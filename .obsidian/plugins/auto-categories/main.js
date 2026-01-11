"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutoCategoriesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_BASE_TEMPLATE = `filters:
  and:
    - categories.contains(link("{{categoryName}}"))
    - '!file.name.contains("Template")'
properties:
  file.name:
    displayName: Name
  created:
    displayName: Created
  file.ctime:
    displayName: File Created
  file.mtime:
    displayName: Modified
  tags:
    displayName: Tags
views:
  - type: table
    name: All
    order:
      - file.name
      - created
      - file.mtime
      - tags
    sort:
      - property: file.mtime
        direction: DESC
  - type: cards
    name: Cards
    coverProperty: cover
    order:
      - file.name
      - created
    sort:
      - property: file.mtime
        direction: DESC`;
var DEFAULT_SETTINGS = {
  categoriesFolder: "Categories",
  basesFolder: "Templates/Bases",
  excludeFolders: ["Templates"],
  showNotifications: true,
  caseSensitive: true,
  syncOnStartup: false,
  nestedSeparator: " - ",
  baseTemplate: DEFAULT_BASE_TEMPLATE
};
var INVALID_CHARS = /[\\:*?"<>|]/g;
var AutoCategoriesPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoCategoriesSettingTab(this.app, this));
    this.addRibbonIcon(
      "folder-sync",
      "Sync All Categories",
      () => this.syncAllCategories()
    );
    this.addCommand({
      id: "sync-all-categories",
      name: "Sync All Categories",
      callback: () => this.syncAllCategories()
    });
    this.addCommand({
      id: "process-current-file",
      name: "Process Current File Categories",
      callback: () => this.processCurrentFile()
    });
    this.addCommand({
      id: "show-categories-overview",
      name: "Show Categories Overview",
      callback: () => this.showCategoriesOverview()
    });
    this.addCommand({
      id: "find-orphan-categories",
      name: "Find Orphan Categories",
      callback: () => this.findOrphanCategories()
    });
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.processFile(file);
      })
    );
    if (this.settings.syncOnStartup) {
      this.app.workspace.onLayoutReady(() => {
        this.syncAllCategories();
      });
    }
    console.log("Auto Categories plugin loaded");
  }
  onunload() {
    console.log("Auto Categories plugin unloaded");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  /**
   * Show a notice if notifications are enabled
   */
  notify(message) {
    if (this.settings.showNotifications) {
      new import_obsidian.Notice(message);
    }
  }
  /**
   * Check if a file should be excluded from processing
   */
  shouldExcludeFile(file) {
    if (file.path.startsWith(this.settings.categoriesFolder + "/")) {
      return true;
    }
    for (const folder of this.settings.excludeFolders) {
      if (folder && file.path.startsWith(folder + "/")) {
        return true;
      }
    }
    return false;
  }
  /**
   * Convert nested category path to flat name with separator
   * e.g., "Travel/Europe/Germany" -> "Travel - Europe - Germany"
   */
  flattenCategoryName(name) {
    if (!name.includes("/")) {
      return name;
    }
    return name.split("/").map((s) => s.trim()).join(this.settings.nestedSeparator);
  }
  /**
   * Validate and sanitize a category name
   */
  validateCategoryName(name) {
    let processed = this.flattenCategoryName(name);
    const trimmed = processed.trim();
    if (!trimmed) {
      return { valid: false, sanitized: "", error: "Category name is empty" };
    }
    if (INVALID_CHARS.test(trimmed)) {
      const sanitized = trimmed.replace(INVALID_CHARS, "-");
      return {
        valid: false,
        sanitized,
        error: `Invalid characters in "${trimmed}", sanitized to "${sanitized}"`
      };
    }
    return { valid: true, sanitized: trimmed };
  }
  /**
   * Remove duplicates from categories array
   */
  deduplicateCategories(categories) {
    const seen = /* @__PURE__ */ new Map();
    for (const cat of categories) {
      const key = this.settings.caseSensitive ? cat : cat.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, cat);
      }
    }
    return Array.from(seen.values());
  }
  /**
   * Process the currently active file
   */
  async processCurrentFile() {
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!(activeView == null ? void 0 : activeView.file)) {
      new import_obsidian.Notice("No active file");
      return;
    }
    await this.processFile(activeView.file);
    this.notify("Categories processed");
  }
  /**
   * Process a single file
   */
  async processFile(file) {
    try {
      if (this.shouldExcludeFile(file)) {
        return;
      }
      const metadata = this.app.metadataCache.getFileCache(file);
      const frontmatter = metadata == null ? void 0 : metadata.frontmatter;
      if (!(frontmatter == null ? void 0 : frontmatter.categories)) return;
      let categories = frontmatter.categories;
      if (!Array.isArray(categories)) {
        categories = [categories];
      }
      const extractedCategories = [];
      let needsUpdate = false;
      const warnings = [];
      for (const cat of categories) {
        const catStr = String(cat);
        const match = catStr.match(/^\[\[([^\]]+)\]\]$/);
        let categoryName;
        if (match) {
          categoryName = match[1];
        } else if (catStr.trim()) {
          categoryName = catStr.trim();
          needsUpdate = true;
        } else {
          continue;
        }
        const validation = this.validateCategoryName(categoryName);
        if (!validation.valid && validation.error) {
          warnings.push(validation.error);
        }
        categoryName = validation.sanitized;
        if (categoryName !== catStr.trim() && categoryName !== (match == null ? void 0 : match[1])) {
          needsUpdate = true;
        }
        if (categoryName) {
          extractedCategories.push(categoryName);
        }
      }
      const uniqueCategories = this.deduplicateCategories(extractedCategories);
      if (uniqueCategories.length !== extractedCategories.length) {
        needsUpdate = true;
      }
      for (const warning of warnings) {
        new import_obsidian.Notice(warning);
      }
      if (needsUpdate) {
        const uniqueNewCategories = uniqueCategories.map((c) => `"[[${c}]]"`);
        await this.updateFrontmatterCategories(file, uniqueNewCategories);
      }
      for (const categoryName of uniqueCategories) {
        await this.ensureCategoryExists(categoryName);
      }
    } catch (error) {
      console.error("Auto Categories: Error processing file", error);
      new import_obsidian.Notice(`Error processing ${file.name}: ${error}`);
    }
  }
  /**
   * Update the frontmatter categories to use wikilinks
   */
  async updateFrontmatterCategories(file, newCategories) {
    try {
      const content = await this.app.vault.read(file);
      const lines = content.split("\n");
      if (lines[0] !== "---") return;
      let frontmatterEnd = -1;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i] === "---") {
          frontmatterEnd = i;
          break;
        }
      }
      if (frontmatterEnd === -1) return;
      let inCategories = false;
      let categoriesStartLine = -1;
      let categoriesEndLine = -1;
      for (let i = 1; i < frontmatterEnd; i++) {
        const line = lines[i];
        if (line.match(/^categories:\s*$/)) {
          inCategories = true;
          categoriesStartLine = i;
        } else if (line.match(/^categories:\s*\[/)) {
          categoriesStartLine = i;
          categoriesEndLine = i;
          break;
        } else if (inCategories) {
          if (line.match(/^\s+-\s/)) {
            categoriesEndLine = i;
          } else if (!line.match(/^\s*$/)) {
            break;
          }
        }
      }
      if (categoriesStartLine === -1) return;
      const newCategoriesLines = ["categories:"];
      for (const cat of newCategories) {
        newCategoriesLines.push(`  - ${cat}`);
      }
      const newLines = [
        ...lines.slice(0, categoriesStartLine),
        ...newCategoriesLines,
        ...lines.slice(categoriesEndLine + 1)
      ];
      await this.app.vault.modify(file, newLines.join("\n"));
    } catch (error) {
      console.error("Auto Categories: Error updating frontmatter", error);
      throw error;
    }
  }
  /**
   * Ensure a category file and its base file exist
   */
  async ensureCategoryExists(categoryName) {
    const categoryPath = `${this.settings.categoriesFolder}/${categoryName}.md`;
    const basePath = `${this.settings.basesFolder}/${categoryName}.base`;
    try {
      await this.ensureFolderExists(this.settings.categoriesFolder);
      await this.ensureFolderExists(this.settings.basesFolder);
      if (!this.app.vault.getAbstractFileByPath(categoryPath)) {
        const categoryContent = `---
tags:
  - categories
---

![[${categoryName}.base]]
`;
        await this.app.vault.create(categoryPath, categoryContent);
        this.notify(`Created category: ${categoryName}`);
      }
      if (!this.app.vault.getAbstractFileByPath(basePath)) {
        const baseContent = this.generateBaseContent(categoryName);
        await this.app.vault.create(basePath, baseContent);
      }
    } catch (error) {
      console.error(
        `Auto Categories: Error creating category "${categoryName}"`,
        error
      );
      new import_obsidian.Notice(`Error creating category "${categoryName}": ${error}`);
    }
  }
  /**
   * Ensure a folder exists
   */
  async ensureFolderExists(folderPath) {
    const parts = folderPath.split("/");
    let currentPath = "";
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const folder = this.app.vault.getAbstractFileByPath(currentPath);
      if (!folder) {
        try {
          await this.app.vault.createFolder(currentPath);
        } catch (error) {
          if (!this.app.vault.getAbstractFileByPath(currentPath)) {
            throw error;
          }
        }
      }
    }
  }
  /**
   * Generate base content using the template
   */
  generateBaseContent(categoryName) {
    return this.settings.baseTemplate.replace(/\{\{categoryName\}\}/g, categoryName) + "\n";
  }
  /**
   * Get all categories used in the vault
   */
  getAllUsedCategories() {
    const allCategories = /* @__PURE__ */ new Set();
    const allFiles = this.app.vault.getMarkdownFiles();
    for (const file of allFiles) {
      if (this.shouldExcludeFile(file)) continue;
      const metadata = this.app.metadataCache.getFileCache(file);
      const frontmatter = metadata == null ? void 0 : metadata.frontmatter;
      if (!(frontmatter == null ? void 0 : frontmatter.categories)) continue;
      let categories = frontmatter.categories;
      if (!Array.isArray(categories)) {
        categories = [categories];
      }
      for (const cat of categories) {
        const catStr = String(cat);
        const match = catStr.match(/\[\[([^\]]+)\]\]/);
        if (match) {
          allCategories.add(match[1]);
        } else if (catStr.trim()) {
          allCategories.add(this.flattenCategoryName(catStr.trim()));
        }
      }
    }
    return allCategories;
  }
  /**
   * Get all existing category files
   */
  getAllExistingCategories() {
    const categoriesFolder = this.app.vault.getAbstractFileByPath(
      this.settings.categoriesFolder
    );
    if (!categoriesFolder || !(categoriesFolder instanceof import_obsidian.TFolder)) {
      return [];
    }
    const categories = [];
    const processFolder = (folder) => {
      for (const child of folder.children) {
        if (child instanceof import_obsidian.TFile && child.extension === "md") {
          categories.push(child.basename);
        } else if (child instanceof import_obsidian.TFolder) {
          processFolder(child);
        }
      }
    };
    processFolder(categoriesFolder);
    return categories;
  }
  /**
   * Show categories overview modal
   */
  showCategoriesOverview() {
    const usedCategories = this.getAllUsedCategories();
    const existingCategories = this.getAllExistingCategories();
    new CategoriesOverviewModal(
      this.app,
      Array.from(usedCategories).sort(),
      existingCategories.sort()
    ).open();
  }
  /**
   * Find and show orphan categories
   */
  findOrphanCategories() {
    const usedCategories = this.getAllUsedCategories();
    const existingCategories = this.getAllExistingCategories();
    const orphans = existingCategories.filter(
      (cat) => !usedCategories.has(cat)
    );
    if (orphans.length === 0) {
      new import_obsidian.Notice("No orphan categories found!");
      return;
    }
    new OrphanCategoriesModal(this.app, this, orphans).open();
  }
  /**
   * Delete a category and its base file
   */
  async deleteCategory(categoryName) {
    const categoryPath = `${this.settings.categoriesFolder}/${categoryName}.md`;
    const basePath = `${this.settings.basesFolder}/${categoryName}.base`;
    try {
      const categoryFile = this.app.vault.getAbstractFileByPath(categoryPath);
      if (categoryFile) {
        await this.app.vault.delete(categoryFile);
      }
      const baseFile = this.app.vault.getAbstractFileByPath(basePath);
      if (baseFile) {
        await this.app.vault.delete(baseFile);
      }
      this.notify(`Deleted category: ${categoryName}`);
    } catch (error) {
      new import_obsidian.Notice(`Error deleting category: ${error}`);
    }
  }
  /**
   * Sync all categories across the vault
   */
  async syncAllCategories() {
    const allFiles = this.app.vault.getMarkdownFiles();
    let processedCount = 0;
    const allCategories = /* @__PURE__ */ new Set();
    let errorCount = 0;
    for (const file of allFiles) {
      if (this.shouldExcludeFile(file)) {
        continue;
      }
      const metadata = this.app.metadataCache.getFileCache(file);
      const frontmatter = metadata == null ? void 0 : metadata.frontmatter;
      if (!(frontmatter == null ? void 0 : frontmatter.categories)) continue;
      let categories = frontmatter.categories;
      if (!Array.isArray(categories)) {
        categories = [categories];
      }
      for (const cat of categories) {
        const catStr = String(cat);
        const match = catStr.match(/\[\[([^\]]+)\]\]/);
        if (match) {
          allCategories.add(match[1]);
        } else if (catStr.trim()) {
          allCategories.add(this.flattenCategoryName(catStr.trim()));
        }
      }
      try {
        await this.processFile(file);
        processedCount++;
      } catch (error) {
        errorCount++;
      }
    }
    let message = `Synced ${allCategories.size} categories from ${processedCount} files`;
    if (errorCount > 0) {
      message += ` (${errorCount} errors)`;
    }
    new import_obsidian.Notice(message);
  }
};
var CategoriesOverviewModal = class extends import_obsidian.Modal {
  constructor(app, usedCategories, existingCategories) {
    super(app);
    this.usedCategories = usedCategories;
    this.existingCategories = existingCategories;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Categories Overview" });
    const statsEl = contentEl.createDiv({ cls: "auto-categories-stats" });
    statsEl.createEl("p", {
      text: `Used in notes: ${this.usedCategories.length}`
    });
    statsEl.createEl("p", {
      text: `Category files: ${this.existingCategories.length}`
    });
    contentEl.createEl("h3", { text: "Used Categories" });
    const usedList = contentEl.createEl("ul");
    for (const cat of this.usedCategories) {
      const li = usedList.createEl("li");
      li.createEl("span", { text: cat });
      if (!this.existingCategories.includes(cat)) {
        li.createEl("span", {
          text: " (missing file)",
          cls: "auto-categories-warning"
        });
      }
    }
    const orphans = this.existingCategories.filter(
      (cat) => !this.usedCategories.includes(cat)
    );
    if (orphans.length > 0) {
      contentEl.createEl("h3", { text: "Orphan Categories (unused)" });
      const orphanList = contentEl.createEl("ul");
      for (const cat of orphans) {
        orphanList.createEl("li", { text: cat });
      }
    }
    contentEl.createEl("style", {
      text: `
        .auto-categories-stats { margin-bottom: 1em; }
        .auto-categories-stats p { margin: 0.25em 0; }
        .auto-categories-warning { color: var(--text-error); margin-left: 0.5em; font-size: 0.85em; }
      `
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var OrphanCategoriesModal = class extends import_obsidian.Modal {
  constructor(app, plugin, orphans) {
    super(app);
    this.plugin = plugin;
    this.orphans = orphans;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Orphan Categories" });
    contentEl.createEl("p", {
      text: `Found ${this.orphans.length} categories that are not used in any note:`
    });
    const list = contentEl.createEl("ul");
    for (const cat of this.orphans) {
      const li = list.createEl("li");
      li.createEl("span", { text: cat });
      const deleteBtn = li.createEl("button", { text: "Delete" });
      deleteBtn.style.marginLeft = "1em";
      deleteBtn.onclick = async () => {
        await this.plugin.deleteCategory(cat);
        li.remove();
        this.orphans = this.orphans.filter((c) => c !== cat);
        if (this.orphans.length === 0) {
          this.close();
        }
      };
    }
    if (this.orphans.length > 1) {
      const deleteAllBtn = contentEl.createEl("button", {
        text: "Delete All Orphans"
      });
      deleteAllBtn.style.marginTop = "1em";
      deleteAllBtn.onclick = async () => {
        for (const cat of [...this.orphans]) {
          await this.plugin.deleteCategory(cat);
        }
        this.close();
      };
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};
var AutoCategoriesSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Auto Categories Settings" });
    containerEl.createEl("h3", { text: "Folders" });
    new import_obsidian.Setting(containerEl).setName("Categories folder").setDesc("Folder where category pages are created").addText(
      (text) => text.setPlaceholder("Categories").setValue(this.plugin.settings.categoriesFolder).onChange(async (value) => {
        this.plugin.settings.categoriesFolder = value || "Categories";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Bases folder").setDesc("Folder where base files are created").addText(
      (text) => text.setPlaceholder("Templates/Bases").setValue(this.plugin.settings.basesFolder).onChange(async (value) => {
        this.plugin.settings.basesFolder = value || "Templates/Bases";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Exclude folders").setDesc("Folders to exclude from processing (comma-separated)").addText(
      (text) => text.setPlaceholder("Templates, Archive").setValue(this.plugin.settings.excludeFolders.join(", ")).onChange(async (value) => {
        this.plugin.settings.excludeFolders = value.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "Behavior" });
    new import_obsidian.Setting(containerEl).setName("Sync on startup").setDesc("Automatically sync all categories when Obsidian starts").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.syncOnStartup).onChange(async (value) => {
        this.plugin.settings.syncOnStartup = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Case sensitive").setDesc("Treat 'Urlaub' and 'urlaub' as different categories").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.caseSensitive).onChange(async (value) => {
        this.plugin.settings.caseSensitive = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Show notifications").setDesc("Show notices when categories are created").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showNotifications).onChange(async (value) => {
        this.plugin.settings.showNotifications = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Nested category separator").setDesc("Separator for nested categories (e.g., Travel/Europe becomes Travel - Europe)").addText(
      (text) => text.setPlaceholder(" - ").setValue(this.plugin.settings.nestedSeparator).onChange(async (value) => {
        this.plugin.settings.nestedSeparator = value || " - ";
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "Base Template" });
    new import_obsidian.Setting(containerEl).setName("Base file template").setDesc("Template for new .base files. Use {{categoryName}} as placeholder.").addTextArea((text) => {
      text.setPlaceholder(DEFAULT_BASE_TEMPLATE).setValue(this.plugin.settings.baseTemplate).onChange(async (value) => {
        this.plugin.settings.baseTemplate = value || DEFAULT_BASE_TEMPLATE;
        await this.plugin.saveSettings();
      });
      text.inputEl.rows = 15;
      text.inputEl.cols = 50;
    });
    const resetBtn = containerEl.createEl("button", {
      text: "Reset to Default Template"
    });
    resetBtn.onclick = async () => {
      this.plugin.settings.baseTemplate = DEFAULT_BASE_TEMPLATE;
      await this.plugin.saveSettings();
      this.display();
    };
    containerEl.createEl("h3", { text: "Commands" });
    containerEl.createEl("p", {
      text: "Use Cmd+P and search for 'Auto Categories' to access commands:",
      cls: "setting-item-description"
    });
    const list = containerEl.createEl("ul");
    list.createEl("li").innerHTML = "<strong>Sync All Categories</strong> - Process all notes in vault";
    list.createEl("li").innerHTML = "<strong>Process Current File</strong> - Process only the active note";
    list.createEl("li").innerHTML = "<strong>Show Categories Overview</strong> - View all categories";
    list.createEl("li").innerHTML = "<strong>Find Orphan Categories</strong> - Find unused categories";
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7XG4gIEFwcCxcbiAgUGx1Z2luLFxuICBQbHVnaW5TZXR0aW5nVGFiLFxuICBTZXR0aW5nLFxuICBOb3RpY2UsXG4gIFRGaWxlLFxuICBURm9sZGVyLFxuICBNYXJrZG93blZpZXcsXG4gIE1vZGFsLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIEF1dG9DYXRlZ29yaWVzU2V0dGluZ3Mge1xuICBjYXRlZ29yaWVzRm9sZGVyOiBzdHJpbmc7XG4gIGJhc2VzRm9sZGVyOiBzdHJpbmc7XG4gIGV4Y2x1ZGVGb2xkZXJzOiBzdHJpbmdbXTtcbiAgc2hvd05vdGlmaWNhdGlvbnM6IGJvb2xlYW47XG4gIGNhc2VTZW5zaXRpdmU6IGJvb2xlYW47XG4gIHN5bmNPblN0YXJ0dXA6IGJvb2xlYW47XG4gIG5lc3RlZFNlcGFyYXRvcjogc3RyaW5nO1xuICBiYXNlVGVtcGxhdGU6IHN0cmluZztcbn1cblxuY29uc3QgREVGQVVMVF9CQVNFX1RFTVBMQVRFID0gYGZpbHRlcnM6XG4gIGFuZDpcbiAgICAtIGNhdGVnb3JpZXMuY29udGFpbnMobGluayhcInt7Y2F0ZWdvcnlOYW1lfX1cIikpXG4gICAgLSAnIWZpbGUubmFtZS5jb250YWlucyhcIlRlbXBsYXRlXCIpJ1xucHJvcGVydGllczpcbiAgZmlsZS5uYW1lOlxuICAgIGRpc3BsYXlOYW1lOiBOYW1lXG4gIGNyZWF0ZWQ6XG4gICAgZGlzcGxheU5hbWU6IENyZWF0ZWRcbiAgZmlsZS5jdGltZTpcbiAgICBkaXNwbGF5TmFtZTogRmlsZSBDcmVhdGVkXG4gIGZpbGUubXRpbWU6XG4gICAgZGlzcGxheU5hbWU6IE1vZGlmaWVkXG4gIHRhZ3M6XG4gICAgZGlzcGxheU5hbWU6IFRhZ3NcbnZpZXdzOlxuICAtIHR5cGU6IHRhYmxlXG4gICAgbmFtZTogQWxsXG4gICAgb3JkZXI6XG4gICAgICAtIGZpbGUubmFtZVxuICAgICAgLSBjcmVhdGVkXG4gICAgICAtIGZpbGUubXRpbWVcbiAgICAgIC0gdGFnc1xuICAgIHNvcnQ6XG4gICAgICAtIHByb3BlcnR5OiBmaWxlLm10aW1lXG4gICAgICAgIGRpcmVjdGlvbjogREVTQ1xuICAtIHR5cGU6IGNhcmRzXG4gICAgbmFtZTogQ2FyZHNcbiAgICBjb3ZlclByb3BlcnR5OiBjb3ZlclxuICAgIG9yZGVyOlxuICAgICAgLSBmaWxlLm5hbWVcbiAgICAgIC0gY3JlYXRlZFxuICAgIHNvcnQ6XG4gICAgICAtIHByb3BlcnR5OiBmaWxlLm10aW1lXG4gICAgICAgIGRpcmVjdGlvbjogREVTQ2A7XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEF1dG9DYXRlZ29yaWVzU2V0dGluZ3MgPSB7XG4gIGNhdGVnb3JpZXNGb2xkZXI6IFwiQ2F0ZWdvcmllc1wiLFxuICBiYXNlc0ZvbGRlcjogXCJUZW1wbGF0ZXMvQmFzZXNcIixcbiAgZXhjbHVkZUZvbGRlcnM6IFtcIlRlbXBsYXRlc1wiXSxcbiAgc2hvd05vdGlmaWNhdGlvbnM6IHRydWUsXG4gIGNhc2VTZW5zaXRpdmU6IHRydWUsXG4gIHN5bmNPblN0YXJ0dXA6IGZhbHNlLFxuICBuZXN0ZWRTZXBhcmF0b3I6IFwiIC0gXCIsXG4gIGJhc2VUZW1wbGF0ZTogREVGQVVMVF9CQVNFX1RFTVBMQVRFLFxufTtcblxuLy8gQ2hhcmFjdGVycyBub3QgYWxsb3dlZCBpbiBmaWxlIG5hbWVzXG5jb25zdCBJTlZBTElEX0NIQVJTID0gL1tcXFxcOio/XCI8PnxdL2c7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9DYXRlZ29yaWVzUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3M6IEF1dG9DYXRlZ29yaWVzU2V0dGluZ3MgPSBERUZBVUxUX1NFVFRJTkdTO1xuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgLy8gQWRkIHNldHRpbmdzIHRhYlxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgQXV0b0NhdGVnb3JpZXNTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICAvLyBBZGQgcmliYm9uIGljb25cbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJmb2xkZXItc3luY1wiLCBcIlN5bmMgQWxsIENhdGVnb3JpZXNcIiwgKCkgPT5cbiAgICAgIHRoaXMuc3luY0FsbENhdGVnb3JpZXMoKVxuICAgICk7XG5cbiAgICAvLyBDb21tYW5kOiBTeW5jIEFsbCBDYXRlZ29yaWVzXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInN5bmMtYWxsLWNhdGVnb3JpZXNcIixcbiAgICAgIG5hbWU6IFwiU3luYyBBbGwgQ2F0ZWdvcmllc1wiLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuc3luY0FsbENhdGVnb3JpZXMoKSxcbiAgICB9KTtcblxuICAgIC8vIENvbW1hbmQ6IFByb2Nlc3MgQ3VycmVudCBGaWxlXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInByb2Nlc3MtY3VycmVudC1maWxlXCIsXG4gICAgICBuYW1lOiBcIlByb2Nlc3MgQ3VycmVudCBGaWxlIENhdGVnb3JpZXNcIixcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnByb2Nlc3NDdXJyZW50RmlsZSgpLFxuICAgIH0pO1xuXG4gICAgLy8gQ29tbWFuZDogU2hvdyBDYXRlZ29yaWVzIE92ZXJ2aWV3XG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInNob3ctY2F0ZWdvcmllcy1vdmVydmlld1wiLFxuICAgICAgbmFtZTogXCJTaG93IENhdGVnb3JpZXMgT3ZlcnZpZXdcIixcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnNob3dDYXRlZ29yaWVzT3ZlcnZpZXcoKSxcbiAgICB9KTtcblxuICAgIC8vIENvbW1hbmQ6IEZpbmQgT3JwaGFuIENhdGVnb3JpZXNcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiZmluZC1vcnBoYW4tY2F0ZWdvcmllc1wiLFxuICAgICAgbmFtZTogXCJGaW5kIE9ycGhhbiBDYXRlZ29yaWVzXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5maW5kT3JwaGFuQ2F0ZWdvcmllcygpLFxuICAgIH0pO1xuXG4gICAgLy8gUHJvY2VzcyBmaWxlIHdoZW4gbWV0YWRhdGEgY2hhbmdlcyAoZnJvbnRtYXR0ZXIgaXMgcGFyc2VkKVxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oJ2NoYW5nZWQnLCAoZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzRmlsZShmaWxlKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIEF1dG8tc3luYyBvbiBzdGFydHVwIGlmIGVuYWJsZWRcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zeW5jT25TdGFydHVwKSB7XG4gICAgICAvLyBXYWl0IGZvciB2YXVsdCB0byBiZSBmdWxseSBsb2FkZWRcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcbiAgICAgICAgdGhpcy5zeW5jQWxsQ2F0ZWdvcmllcygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJBdXRvIENhdGVnb3JpZXMgcGx1Z2luIGxvYWRlZFwiKTtcbiAgfVxuXG4gIG9udW5sb2FkKCkge1xuICAgIGNvbnNvbGUubG9nKFwiQXV0byBDYXRlZ29yaWVzIHBsdWdpbiB1bmxvYWRlZFwiKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgYSBub3RpY2UgaWYgbm90aWZpY2F0aW9ucyBhcmUgZW5hYmxlZFxuICAgKi9cbiAgcHJpdmF0ZSBub3RpZnkobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd05vdGlmaWNhdGlvbnMpIHtcbiAgICAgIG5ldyBOb3RpY2UobWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgZmlsZSBzaG91bGQgYmUgZXhjbHVkZWQgZnJvbSBwcm9jZXNzaW5nXG4gICAqL1xuICBwcml2YXRlIHNob3VsZEV4Y2x1ZGVGaWxlKGZpbGU6IFRGaWxlKTogYm9vbGVhbiB7XG4gICAgaWYgKGZpbGUucGF0aC5zdGFydHNXaXRoKHRoaXMuc2V0dGluZ3MuY2F0ZWdvcmllc0ZvbGRlciArIFwiL1wiKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmb2xkZXIgb2YgdGhpcy5zZXR0aW5ncy5leGNsdWRlRm9sZGVycykge1xuICAgICAgaWYgKGZvbGRlciAmJiBmaWxlLnBhdGguc3RhcnRzV2l0aChmb2xkZXIgKyBcIi9cIikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgbmVzdGVkIGNhdGVnb3J5IHBhdGggdG8gZmxhdCBuYW1lIHdpdGggc2VwYXJhdG9yXG4gICAqIGUuZy4sIFwiVHJhdmVsL0V1cm9wZS9HZXJtYW55XCIgLT4gXCJUcmF2ZWwgLSBFdXJvcGUgLSBHZXJtYW55XCJcbiAgICovXG4gIHByaXZhdGUgZmxhdHRlbkNhdGVnb3J5TmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghbmFtZS5pbmNsdWRlcyhcIi9cIikpIHtcbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZS5zcGxpdChcIi9cIikubWFwKHMgPT4gcy50cmltKCkpLmpvaW4odGhpcy5zZXR0aW5ncy5uZXN0ZWRTZXBhcmF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGFuZCBzYW5pdGl6ZSBhIGNhdGVnb3J5IG5hbWVcbiAgICovXG4gIHByaXZhdGUgdmFsaWRhdGVDYXRlZ29yeU5hbWUobmFtZTogc3RyaW5nKToge1xuICAgIHZhbGlkOiBib29sZWFuO1xuICAgIHNhbml0aXplZDogc3RyaW5nO1xuICAgIGVycm9yPzogc3RyaW5nO1xuICB9IHtcbiAgICAvLyBGaXJzdCBmbGF0dGVuIG5lc3RlZCBwYXRoc1xuICAgIGxldCBwcm9jZXNzZWQgPSB0aGlzLmZsYXR0ZW5DYXRlZ29yeU5hbWUobmFtZSk7XG4gICAgY29uc3QgdHJpbW1lZCA9IHByb2Nlc3NlZC50cmltKCk7XG5cbiAgICBpZiAoIXRyaW1tZWQpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgc2FuaXRpemVkOiBcIlwiLCBlcnJvcjogXCJDYXRlZ29yeSBuYW1lIGlzIGVtcHR5XCIgfTtcbiAgICB9XG5cbiAgICBpZiAoSU5WQUxJRF9DSEFSUy50ZXN0KHRyaW1tZWQpKSB7XG4gICAgICBjb25zdCBzYW5pdGl6ZWQgPSB0cmltbWVkLnJlcGxhY2UoSU5WQUxJRF9DSEFSUywgXCItXCIpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICBzYW5pdGl6ZWQsXG4gICAgICAgIGVycm9yOiBgSW52YWxpZCBjaGFyYWN0ZXJzIGluIFwiJHt0cmltbWVkfVwiLCBzYW5pdGl6ZWQgdG8gXCIke3Nhbml0aXplZH1cImAsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBzYW5pdGl6ZWQ6IHRyaW1tZWQgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGNhdGVnb3JpZXMgYXJyYXlcbiAgICovXG4gIHByaXZhdGUgZGVkdXBsaWNhdGVDYXRlZ29yaWVzKGNhdGVnb3JpZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXG4gICAgZm9yIChjb25zdCBjYXQgb2YgY2F0ZWdvcmllcykge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5zZXR0aW5ncy5jYXNlU2Vuc2l0aXZlID8gY2F0IDogY2F0LnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIXNlZW4uaGFzKGtleSkpIHtcbiAgICAgICAgc2Vlbi5zZXQoa2V5LCBjYXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBBcnJheS5mcm9tKHNlZW4udmFsdWVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3MgdGhlIGN1cnJlbnRseSBhY3RpdmUgZmlsZVxuICAgKi9cbiAgYXN5bmMgcHJvY2Vzc0N1cnJlbnRGaWxlKCkge1xuICAgIGNvbnN0IGFjdGl2ZVZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICghYWN0aXZlVmlldz8uZmlsZSkge1xuICAgICAgbmV3IE5vdGljZShcIk5vIGFjdGl2ZSBmaWxlXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLnByb2Nlc3NGaWxlKGFjdGl2ZVZpZXcuZmlsZSk7XG4gICAgdGhpcy5ub3RpZnkoXCJDYXRlZ29yaWVzIHByb2Nlc3NlZFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGEgc2luZ2xlIGZpbGVcbiAgICovXG4gIGFzeW5jIHByb2Nlc3NGaWxlKGZpbGU6IFRGaWxlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLnNob3VsZEV4Y2x1ZGVGaWxlKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgICAgIGNvbnN0IGZyb250bWF0dGVyID0gbWV0YWRhdGE/LmZyb250bWF0dGVyO1xuXG4gICAgICBpZiAoIWZyb250bWF0dGVyPy5jYXRlZ29yaWVzKSByZXR1cm47XG5cbiAgICAgIGxldCBjYXRlZ29yaWVzID0gZnJvbnRtYXR0ZXIuY2F0ZWdvcmllcztcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjYXRlZ29yaWVzKSkge1xuICAgICAgICBjYXRlZ29yaWVzID0gW2NhdGVnb3JpZXNdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHRyYWN0ZWRDYXRlZ29yaWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgbGV0IG5lZWRzVXBkYXRlID0gZmFsc2U7XG4gICAgICBjb25zdCB3YXJuaW5nczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgZm9yIChjb25zdCBjYXQgb2YgY2F0ZWdvcmllcykge1xuICAgICAgICBjb25zdCBjYXRTdHIgPSBTdHJpbmcoY2F0KTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBjYXRTdHIubWF0Y2goL15cXFtcXFsoW15cXF1dKylcXF1cXF0kLyk7XG5cbiAgICAgICAgbGV0IGNhdGVnb3J5TmFtZTogc3RyaW5nO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIGNhdGVnb3J5TmFtZSA9IG1hdGNoWzFdO1xuICAgICAgICB9IGVsc2UgaWYgKGNhdFN0ci50cmltKCkpIHtcbiAgICAgICAgICBjYXRlZ29yeU5hbWUgPSBjYXRTdHIudHJpbSgpO1xuICAgICAgICAgIG5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZhbGlkYXRlIGFuZCBwb3RlbnRpYWxseSBmbGF0dGVuIGNhdGVnb3J5IG5hbWVcbiAgICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IHRoaXMudmFsaWRhdGVDYXRlZ29yeU5hbWUoY2F0ZWdvcnlOYW1lKTtcbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uLnZhbGlkICYmIHZhbGlkYXRpb24uZXJyb3IpIHtcbiAgICAgICAgICB3YXJuaW5ncy5wdXNoKHZhbGlkYXRpb24uZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2F0ZWdvcnlOYW1lID0gdmFsaWRhdGlvbi5zYW5pdGl6ZWQ7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbmFtZSBjaGFuZ2VkIGR1ZSB0byBmbGF0dGVuaW5nXG4gICAgICAgIGlmIChjYXRlZ29yeU5hbWUgIT09IGNhdFN0ci50cmltKCkgJiYgY2F0ZWdvcnlOYW1lICE9PSBtYXRjaD8uWzFdKSB7XG4gICAgICAgICAgbmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhdGVnb3J5TmFtZSkge1xuICAgICAgICAgIGV4dHJhY3RlZENhdGVnb3JpZXMucHVzaChjYXRlZ29yeU5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERlZHVwbGljYXRlIGNhdGVnb3JpZXNcbiAgICAgIGNvbnN0IHVuaXF1ZUNhdGVnb3JpZXMgPSB0aGlzLmRlZHVwbGljYXRlQ2F0ZWdvcmllcyhleHRyYWN0ZWRDYXRlZ29yaWVzKTtcblxuICAgICAgaWYgKHVuaXF1ZUNhdGVnb3JpZXMubGVuZ3RoICE9PSBleHRyYWN0ZWRDYXRlZ29yaWVzLmxlbmd0aCkge1xuICAgICAgICBuZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFNob3cgd2FybmluZ3NcbiAgICAgIGZvciAoY29uc3Qgd2FybmluZyBvZiB3YXJuaW5ncykge1xuICAgICAgICBuZXcgTm90aWNlKHdhcm5pbmcpO1xuICAgICAgfVxuXG4gICAgICAvLyBVcGRhdGUgZnJvbnRtYXR0ZXIgaWYgbmVlZGVkXG4gICAgICBpZiAobmVlZHNVcGRhdGUpIHtcbiAgICAgICAgY29uc3QgdW5pcXVlTmV3Q2F0ZWdvcmllcyA9IHVuaXF1ZUNhdGVnb3JpZXMubWFwKChjKSA9PiBgXCJbWyR7Y31dXVwiYCk7XG4gICAgICAgIGF3YWl0IHRoaXMudXBkYXRlRnJvbnRtYXR0ZXJDYXRlZ29yaWVzKGZpbGUsIHVuaXF1ZU5ld0NhdGVnb3JpZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgY2F0ZWdvcnkgYW5kIGJhc2UgZmlsZXNcbiAgICAgIGZvciAoY29uc3QgY2F0ZWdvcnlOYW1lIG9mIHVuaXF1ZUNhdGVnb3JpZXMpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5lbnN1cmVDYXRlZ29yeUV4aXN0cyhjYXRlZ29yeU5hbWUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQXV0byBDYXRlZ29yaWVzOiBFcnJvciBwcm9jZXNzaW5nIGZpbGVcIiwgZXJyb3IpO1xuICAgICAgbmV3IE5vdGljZShgRXJyb3IgcHJvY2Vzc2luZyAke2ZpbGUubmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgZnJvbnRtYXR0ZXIgY2F0ZWdvcmllcyB0byB1c2Ugd2lraWxpbmtzXG4gICAqL1xuICBhc3luYyB1cGRhdGVGcm9udG1hdHRlckNhdGVnb3JpZXMoZmlsZTogVEZpbGUsIG5ld0NhdGVnb3JpZXM6IHN0cmluZ1tdKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xuICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICBpZiAobGluZXNbMF0gIT09IFwiLS0tXCIpIHJldHVybjtcblxuICAgICAgbGV0IGZyb250bWF0dGVyRW5kID0gLTE7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChsaW5lc1tpXSA9PT0gXCItLS1cIikge1xuICAgICAgICAgIGZyb250bWF0dGVyRW5kID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbnRtYXR0ZXJFbmQgPT09IC0xKSByZXR1cm47XG5cbiAgICAgIGxldCBpbkNhdGVnb3JpZXMgPSBmYWxzZTtcbiAgICAgIGxldCBjYXRlZ29yaWVzU3RhcnRMaW5lID0gLTE7XG4gICAgICBsZXQgY2F0ZWdvcmllc0VuZExpbmUgPSAtMTtcblxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBmcm9udG1hdHRlckVuZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXTtcblxuICAgICAgICBpZiAobGluZS5tYXRjaCgvXmNhdGVnb3JpZXM6XFxzKiQvKSkge1xuICAgICAgICAgIGluQ2F0ZWdvcmllcyA9IHRydWU7XG4gICAgICAgICAgY2F0ZWdvcmllc1N0YXJ0TGluZSA9IGk7XG4gICAgICAgIH0gZWxzZSBpZiAobGluZS5tYXRjaCgvXmNhdGVnb3JpZXM6XFxzKlxcWy8pKSB7XG4gICAgICAgICAgY2F0ZWdvcmllc1N0YXJ0TGluZSA9IGk7XG4gICAgICAgICAgY2F0ZWdvcmllc0VuZExpbmUgPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2UgaWYgKGluQ2F0ZWdvcmllcykge1xuICAgICAgICAgIGlmIChsaW5lLm1hdGNoKC9eXFxzKy1cXHMvKSkge1xuICAgICAgICAgICAgY2F0ZWdvcmllc0VuZExpbmUgPSBpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWxpbmUubWF0Y2goL15cXHMqJC8pKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhdGVnb3JpZXNTdGFydExpbmUgPT09IC0xKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IG5ld0NhdGVnb3JpZXNMaW5lcyA9IFtcImNhdGVnb3JpZXM6XCJdO1xuICAgICAgZm9yIChjb25zdCBjYXQgb2YgbmV3Q2F0ZWdvcmllcykge1xuICAgICAgICBuZXdDYXRlZ29yaWVzTGluZXMucHVzaChgICAtICR7Y2F0fWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdMaW5lcyA9IFtcbiAgICAgICAgLi4ubGluZXMuc2xpY2UoMCwgY2F0ZWdvcmllc1N0YXJ0TGluZSksXG4gICAgICAgIC4uLm5ld0NhdGVnb3JpZXNMaW5lcyxcbiAgICAgICAgLi4ubGluZXMuc2xpY2UoY2F0ZWdvcmllc0VuZExpbmUgKyAxKSxcbiAgICAgIF07XG5cbiAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBuZXdMaW5lcy5qb2luKFwiXFxuXCIpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkF1dG8gQ2F0ZWdvcmllczogRXJyb3IgdXBkYXRpbmcgZnJvbnRtYXR0ZXJcIiwgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZSBhIGNhdGVnb3J5IGZpbGUgYW5kIGl0cyBiYXNlIGZpbGUgZXhpc3RcbiAgICovXG4gIGFzeW5jIGVuc3VyZUNhdGVnb3J5RXhpc3RzKGNhdGVnb3J5TmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgY2F0ZWdvcnlQYXRoID0gYCR7dGhpcy5zZXR0aW5ncy5jYXRlZ29yaWVzRm9sZGVyfS8ke2NhdGVnb3J5TmFtZX0ubWRgO1xuICAgIGNvbnN0IGJhc2VQYXRoID0gYCR7dGhpcy5zZXR0aW5ncy5iYXNlc0ZvbGRlcn0vJHtjYXRlZ29yeU5hbWV9LmJhc2VgO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZW5zdXJlRm9sZGVyRXhpc3RzKHRoaXMuc2V0dGluZ3MuY2F0ZWdvcmllc0ZvbGRlcik7XG4gICAgICBhd2FpdCB0aGlzLmVuc3VyZUZvbGRlckV4aXN0cyh0aGlzLnNldHRpbmdzLmJhc2VzRm9sZGVyKTtcblxuICAgICAgaWYgKCF0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoY2F0ZWdvcnlQYXRoKSkge1xuICAgICAgICBjb25zdCBjYXRlZ29yeUNvbnRlbnQgPSBgLS0tXG50YWdzOlxuICAtIGNhdGVnb3JpZXNcbi0tLVxuXG4hW1ske2NhdGVnb3J5TmFtZX0uYmFzZV1dXG5gO1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoY2F0ZWdvcnlQYXRoLCBjYXRlZ29yeUNvbnRlbnQpO1xuICAgICAgICB0aGlzLm5vdGlmeShgQ3JlYXRlZCBjYXRlZ29yeTogJHtjYXRlZ29yeU5hbWV9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGJhc2VQYXRoKSkge1xuICAgICAgICBjb25zdCBiYXNlQ29udGVudCA9IHRoaXMuZ2VuZXJhdGVCYXNlQ29udGVudChjYXRlZ29yeU5hbWUpO1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoYmFzZVBhdGgsIGJhc2VDb250ZW50KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgYEF1dG8gQ2F0ZWdvcmllczogRXJyb3IgY3JlYXRpbmcgY2F0ZWdvcnkgXCIke2NhdGVnb3J5TmFtZX1cImAsXG4gICAgICAgIGVycm9yXG4gICAgICApO1xuICAgICAgbmV3IE5vdGljZShgRXJyb3IgY3JlYXRpbmcgY2F0ZWdvcnkgXCIke2NhdGVnb3J5TmFtZX1cIjogJHtlcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIGEgZm9sZGVyIGV4aXN0c1xuICAgKi9cbiAgYXN5bmMgZW5zdXJlRm9sZGVyRXhpc3RzKGZvbGRlclBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHBhcnRzID0gZm9sZGVyUGF0aC5zcGxpdChcIi9cIik7XG4gICAgbGV0IGN1cnJlbnRQYXRoID0gXCJcIjtcblxuICAgIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuICAgICAgY3VycmVudFBhdGggPSBjdXJyZW50UGF0aCA/IGAke2N1cnJlbnRQYXRofS8ke3BhcnR9YCA6IHBhcnQ7XG4gICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoY3VycmVudFBhdGgpO1xuICAgICAgaWYgKCFmb2xkZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoY3VycmVudFBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGlmICghdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGN1cnJlbnRQYXRoKSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGJhc2UgY29udGVudCB1c2luZyB0aGUgdGVtcGxhdGVcbiAgICovXG4gIGdlbmVyYXRlQmFzZUNvbnRlbnQoY2F0ZWdvcnlOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmJhc2VUZW1wbGF0ZS5yZXBsYWNlKC9cXHtcXHtjYXRlZ29yeU5hbWVcXH1cXH0vZywgY2F0ZWdvcnlOYW1lKSArIFwiXFxuXCI7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBjYXRlZ29yaWVzIHVzZWQgaW4gdGhlIHZhdWx0XG4gICAqL1xuICBnZXRBbGxVc2VkQ2F0ZWdvcmllcygpOiBTZXQ8c3RyaW5nPiB7XG4gICAgY29uc3QgYWxsQ2F0ZWdvcmllcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnN0IGFsbEZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGFsbEZpbGVzKSB7XG4gICAgICBpZiAodGhpcy5zaG91bGRFeGNsdWRlRmlsZShmaWxlKSkgY29udGludWU7XG5cbiAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gICAgICBjb25zdCBmcm9udG1hdHRlciA9IG1ldGFkYXRhPy5mcm9udG1hdHRlcjtcblxuICAgICAgaWYgKCFmcm9udG1hdHRlcj8uY2F0ZWdvcmllcykgY29udGludWU7XG5cbiAgICAgIGxldCBjYXRlZ29yaWVzID0gZnJvbnRtYXR0ZXIuY2F0ZWdvcmllcztcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShjYXRlZ29yaWVzKSkge1xuICAgICAgICBjYXRlZ29yaWVzID0gW2NhdGVnb3JpZXNdO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IGNhdCBvZiBjYXRlZ29yaWVzKSB7XG4gICAgICAgIGNvbnN0IGNhdFN0ciA9IFN0cmluZyhjYXQpO1xuICAgICAgICBjb25zdCBtYXRjaCA9IGNhdFN0ci5tYXRjaCgvXFxbXFxbKFteXFxdXSspXFxdXFxdLyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgYWxsQ2F0ZWdvcmllcy5hZGQobWF0Y2hbMV0pO1xuICAgICAgICB9IGVsc2UgaWYgKGNhdFN0ci50cmltKCkpIHtcbiAgICAgICAgICBhbGxDYXRlZ29yaWVzLmFkZCh0aGlzLmZsYXR0ZW5DYXRlZ29yeU5hbWUoY2F0U3RyLnRyaW0oKSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbENhdGVnb3JpZXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBleGlzdGluZyBjYXRlZ29yeSBmaWxlc1xuICAgKi9cbiAgZ2V0QWxsRXhpc3RpbmdDYXRlZ29yaWVzKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBjYXRlZ29yaWVzRm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFxuICAgICAgdGhpcy5zZXR0aW5ncy5jYXRlZ29yaWVzRm9sZGVyXG4gICAgKTtcblxuICAgIGlmICghY2F0ZWdvcmllc0ZvbGRlciB8fCAhKGNhdGVnb3JpZXNGb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGNhdGVnb3JpZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBjb25zdCBwcm9jZXNzRm9sZGVyID0gKGZvbGRlcjogVEZvbGRlcikgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmb2xkZXIuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgVEZpbGUgJiYgY2hpbGQuZXh0ZW5zaW9uID09PSBcIm1kXCIpIHtcbiAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2hpbGQuYmFzZW5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICAgIHByb2Nlc3NGb2xkZXIoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHByb2Nlc3NGb2xkZXIoY2F0ZWdvcmllc0ZvbGRlcik7XG4gICAgcmV0dXJuIGNhdGVnb3JpZXM7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyBjYXRlZ29yaWVzIG92ZXJ2aWV3IG1vZGFsXG4gICAqL1xuICBzaG93Q2F0ZWdvcmllc092ZXJ2aWV3KCkge1xuICAgIGNvbnN0IHVzZWRDYXRlZ29yaWVzID0gdGhpcy5nZXRBbGxVc2VkQ2F0ZWdvcmllcygpO1xuICAgIGNvbnN0IGV4aXN0aW5nQ2F0ZWdvcmllcyA9IHRoaXMuZ2V0QWxsRXhpc3RpbmdDYXRlZ29yaWVzKCk7XG5cbiAgICBuZXcgQ2F0ZWdvcmllc092ZXJ2aWV3TW9kYWwoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIEFycmF5LmZyb20odXNlZENhdGVnb3JpZXMpLnNvcnQoKSxcbiAgICAgIGV4aXN0aW5nQ2F0ZWdvcmllcy5zb3J0KClcbiAgICApLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGFuZCBzaG93IG9ycGhhbiBjYXRlZ29yaWVzXG4gICAqL1xuICBmaW5kT3JwaGFuQ2F0ZWdvcmllcygpIHtcbiAgICBjb25zdCB1c2VkQ2F0ZWdvcmllcyA9IHRoaXMuZ2V0QWxsVXNlZENhdGVnb3JpZXMoKTtcbiAgICBjb25zdCBleGlzdGluZ0NhdGVnb3JpZXMgPSB0aGlzLmdldEFsbEV4aXN0aW5nQ2F0ZWdvcmllcygpO1xuXG4gICAgY29uc3Qgb3JwaGFucyA9IGV4aXN0aW5nQ2F0ZWdvcmllcy5maWx0ZXIoXG4gICAgICAoY2F0KSA9PiAhdXNlZENhdGVnb3JpZXMuaGFzKGNhdClcbiAgICApO1xuXG4gICAgaWYgKG9ycGhhbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBuZXcgTm90aWNlKFwiTm8gb3JwaGFuIGNhdGVnb3JpZXMgZm91bmQhXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5ldyBPcnBoYW5DYXRlZ29yaWVzTW9kYWwodGhpcy5hcHAsIHRoaXMsIG9ycGhhbnMpLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgYSBjYXRlZ29yeSBhbmQgaXRzIGJhc2UgZmlsZVxuICAgKi9cbiAgYXN5bmMgZGVsZXRlQ2F0ZWdvcnkoY2F0ZWdvcnlOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjYXRlZ29yeVBhdGggPSBgJHt0aGlzLnNldHRpbmdzLmNhdGVnb3JpZXNGb2xkZXJ9LyR7Y2F0ZWdvcnlOYW1lfS5tZGA7XG4gICAgY29uc3QgYmFzZVBhdGggPSBgJHt0aGlzLnNldHRpbmdzLmJhc2VzRm9sZGVyfS8ke2NhdGVnb3J5TmFtZX0uYmFzZWA7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgY2F0ZWdvcnlGaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGNhdGVnb3J5UGF0aCk7XG4gICAgICBpZiAoY2F0ZWdvcnlGaWxlKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmRlbGV0ZShjYXRlZ29yeUZpbGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBiYXNlRmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChiYXNlUGF0aCk7XG4gICAgICBpZiAoYmFzZUZpbGUpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuZGVsZXRlKGJhc2VGaWxlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ub3RpZnkoYERlbGV0ZWQgY2F0ZWdvcnk6ICR7Y2F0ZWdvcnlOYW1lfWApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBuZXcgTm90aWNlKGBFcnJvciBkZWxldGluZyBjYXRlZ29yeTogJHtlcnJvcn1gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3luYyBhbGwgY2F0ZWdvcmllcyBhY3Jvc3MgdGhlIHZhdWx0XG4gICAqL1xuICBhc3luYyBzeW5jQWxsQ2F0ZWdvcmllcygpIHtcbiAgICBjb25zdCBhbGxGaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcbiAgICBsZXQgcHJvY2Vzc2VkQ291bnQgPSAwO1xuICAgIGNvbnN0IGFsbENhdGVnb3JpZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBsZXQgZXJyb3JDb3VudCA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgYWxsRmlsZXMpIHtcbiAgICAgIGlmICh0aGlzLnNob3VsZEV4Y2x1ZGVGaWxlKGZpbGUpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICAgICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBtZXRhZGF0YT8uZnJvbnRtYXR0ZXI7XG5cbiAgICAgIGlmICghZnJvbnRtYXR0ZXI/LmNhdGVnb3JpZXMpIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgY2F0ZWdvcmllcyA9IGZyb250bWF0dGVyLmNhdGVnb3JpZXM7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2F0ZWdvcmllcykpIHtcbiAgICAgICAgY2F0ZWdvcmllcyA9IFtjYXRlZ29yaWVzXTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBjYXQgb2YgY2F0ZWdvcmllcykge1xuICAgICAgICBjb25zdCBjYXRTdHIgPSBTdHJpbmcoY2F0KTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBjYXRTdHIubWF0Y2goL1xcW1xcWyhbXlxcXV0rKVxcXVxcXS8pO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIGFsbENhdGVnb3JpZXMuYWRkKG1hdGNoWzFdKTtcbiAgICAgICAgfSBlbHNlIGlmIChjYXRTdHIudHJpbSgpKSB7XG4gICAgICAgICAgYWxsQ2F0ZWdvcmllcy5hZGQodGhpcy5mbGF0dGVuQ2F0ZWdvcnlOYW1lKGNhdFN0ci50cmltKCkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLnByb2Nlc3NGaWxlKGZpbGUpO1xuICAgICAgICBwcm9jZXNzZWRDb3VudCsrO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyb3JDb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBtZXNzYWdlID0gYFN5bmNlZCAke2FsbENhdGVnb3JpZXMuc2l6ZX0gY2F0ZWdvcmllcyBmcm9tICR7cHJvY2Vzc2VkQ291bnR9IGZpbGVzYDtcbiAgICBpZiAoZXJyb3JDb3VudCA+IDApIHtcbiAgICAgIG1lc3NhZ2UgKz0gYCAoJHtlcnJvckNvdW50fSBlcnJvcnMpYDtcbiAgICB9XG4gICAgbmV3IE5vdGljZShtZXNzYWdlKTtcbiAgfVxufVxuXG4vKipcbiAqIENhdGVnb3JpZXMgT3ZlcnZpZXcgTW9kYWxcbiAqL1xuY2xhc3MgQ2F0ZWdvcmllc092ZXJ2aWV3TW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHVzZWRDYXRlZ29yaWVzOiBzdHJpbmdbXTtcbiAgZXhpc3RpbmdDYXRlZ29yaWVzOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgdXNlZENhdGVnb3JpZXM6IHN0cmluZ1tdLCBleGlzdGluZ0NhdGVnb3JpZXM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLnVzZWRDYXRlZ29yaWVzID0gdXNlZENhdGVnb3JpZXM7XG4gICAgdGhpcy5leGlzdGluZ0NhdGVnb3JpZXMgPSBleGlzdGluZ0NhdGVnb3JpZXM7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmVtcHR5KCk7XG5cbiAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiQ2F0ZWdvcmllcyBPdmVydmlld1wiIH0pO1xuXG4gICAgLy8gU3RhdHNcbiAgICBjb25zdCBzdGF0c0VsID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJhdXRvLWNhdGVnb3JpZXMtc3RhdHNcIiB9KTtcbiAgICBzdGF0c0VsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICB0ZXh0OiBgVXNlZCBpbiBub3RlczogJHt0aGlzLnVzZWRDYXRlZ29yaWVzLmxlbmd0aH1gLFxuICAgIH0pO1xuICAgIHN0YXRzRWwuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIHRleHQ6IGBDYXRlZ29yeSBmaWxlczogJHt0aGlzLmV4aXN0aW5nQ2F0ZWdvcmllcy5sZW5ndGh9YCxcbiAgICB9KTtcblxuICAgIC8vIFVzZWQgY2F0ZWdvcmllc1xuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJVc2VkIENhdGVnb3JpZXNcIiB9KTtcbiAgICBjb25zdCB1c2VkTGlzdCA9IGNvbnRlbnRFbC5jcmVhdGVFbChcInVsXCIpO1xuICAgIGZvciAoY29uc3QgY2F0IG9mIHRoaXMudXNlZENhdGVnb3JpZXMpIHtcbiAgICAgIGNvbnN0IGxpID0gdXNlZExpc3QuY3JlYXRlRWwoXCJsaVwiKTtcbiAgICAgIGxpLmNyZWF0ZUVsKFwic3BhblwiLCB7IHRleHQ6IGNhdCB9KTtcbiAgICAgIGlmICghdGhpcy5leGlzdGluZ0NhdGVnb3JpZXMuaW5jbHVkZXMoY2F0KSkge1xuICAgICAgICBsaS5jcmVhdGVFbChcInNwYW5cIiwge1xuICAgICAgICAgIHRleHQ6IFwiIChtaXNzaW5nIGZpbGUpXCIsXG4gICAgICAgICAgY2xzOiBcImF1dG8tY2F0ZWdvcmllcy13YXJuaW5nXCIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE9ycGhhbnNcbiAgICBjb25zdCBvcnBoYW5zID0gdGhpcy5leGlzdGluZ0NhdGVnb3JpZXMuZmlsdGVyKFxuICAgICAgKGNhdCkgPT4gIXRoaXMudXNlZENhdGVnb3JpZXMuaW5jbHVkZXMoY2F0KVxuICAgICk7XG4gICAgaWYgKG9ycGhhbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29udGVudEVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIk9ycGhhbiBDYXRlZ29yaWVzICh1bnVzZWQpXCIgfSk7XG4gICAgICBjb25zdCBvcnBoYW5MaXN0ID0gY29udGVudEVsLmNyZWF0ZUVsKFwidWxcIik7XG4gICAgICBmb3IgKGNvbnN0IGNhdCBvZiBvcnBoYW5zKSB7XG4gICAgICAgIG9ycGhhbkxpc3QuY3JlYXRlRWwoXCJsaVwiLCB7IHRleHQ6IGNhdCB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdHlsZVxuICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInN0eWxlXCIsIHtcbiAgICAgIHRleHQ6IGBcbiAgICAgICAgLmF1dG8tY2F0ZWdvcmllcy1zdGF0cyB7IG1hcmdpbi1ib3R0b206IDFlbTsgfVxuICAgICAgICAuYXV0by1jYXRlZ29yaWVzLXN0YXRzIHAgeyBtYXJnaW46IDAuMjVlbSAwOyB9XG4gICAgICAgIC5hdXRvLWNhdGVnb3JpZXMtd2FybmluZyB7IGNvbG9yOiB2YXIoLS10ZXh0LWVycm9yKTsgbWFyZ2luLWxlZnQ6IDAuNWVtOyBmb250LXNpemU6IDAuODVlbTsgfVxuICAgICAgYCxcbiAgICB9KTtcbiAgfVxuXG4gIG9uQ2xvc2UoKSB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgfVxufVxuXG4vKipcbiAqIE9ycGhhbiBDYXRlZ29yaWVzIE1vZGFsXG4gKi9cbmNsYXNzIE9ycGhhbkNhdGVnb3JpZXNNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcGx1Z2luOiBBdXRvQ2F0ZWdvcmllc1BsdWdpbjtcbiAgb3JwaGFuczogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogQXV0b0NhdGVnb3JpZXNQbHVnaW4sIG9ycGhhbnM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB0aGlzLm9ycGhhbnMgPSBvcnBoYW5zO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuXG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIk9ycGhhbiBDYXRlZ29yaWVzXCIgfSk7XG4gICAgY29udGVudEVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICB0ZXh0OiBgRm91bmQgJHt0aGlzLm9ycGhhbnMubGVuZ3RofSBjYXRlZ29yaWVzIHRoYXQgYXJlIG5vdCB1c2VkIGluIGFueSBub3RlOmAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsaXN0ID0gY29udGVudEVsLmNyZWF0ZUVsKFwidWxcIik7XG4gICAgZm9yIChjb25zdCBjYXQgb2YgdGhpcy5vcnBoYW5zKSB7XG4gICAgICBjb25zdCBsaSA9IGxpc3QuY3JlYXRlRWwoXCJsaVwiKTtcbiAgICAgIGxpLmNyZWF0ZUVsKFwic3BhblwiLCB7IHRleHQ6IGNhdCB9KTtcblxuICAgICAgY29uc3QgZGVsZXRlQnRuID0gbGkuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkRlbGV0ZVwiIH0pO1xuICAgICAgZGVsZXRlQnRuLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjFlbVwiO1xuICAgICAgZGVsZXRlQnRuLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLmRlbGV0ZUNhdGVnb3J5KGNhdCk7XG4gICAgICAgIGxpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLm9ycGhhbnMgPSB0aGlzLm9ycGhhbnMuZmlsdGVyKChjKSA9PiBjICE9PSBjYXQpO1xuICAgICAgICBpZiAodGhpcy5vcnBoYW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBEZWxldGUgYWxsIGJ1dHRvblxuICAgIGlmICh0aGlzLm9ycGhhbnMubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgZGVsZXRlQWxsQnRuID0gY29udGVudEVsLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICAgICAgdGV4dDogXCJEZWxldGUgQWxsIE9ycGhhbnNcIixcbiAgICAgIH0pO1xuICAgICAgZGVsZXRlQWxsQnRuLnN0eWxlLm1hcmdpblRvcCA9IFwiMWVtXCI7XG4gICAgICBkZWxldGVBbGxCdG4ub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBjYXQgb2YgWy4uLnRoaXMub3JwaGFuc10pIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5kZWxldGVDYXRlZ29yeShjYXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICB9XG59XG5cbi8qKlxuICogU2V0dGluZ3MgVGFiXG4gKi9cbmNsYXNzIEF1dG9DYXRlZ29yaWVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IEF1dG9DYXRlZ29yaWVzUGx1Z2luO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IEF1dG9DYXRlZ29yaWVzUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJBdXRvIENhdGVnb3JpZXMgU2V0dGluZ3NcIiB9KTtcblxuICAgIC8vIEZvbGRlcnMgU2VjdGlvblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkZvbGRlcnNcIiB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDYXRlZ29yaWVzIGZvbGRlclwiKVxuICAgICAgLnNldERlc2MoXCJGb2xkZXIgd2hlcmUgY2F0ZWdvcnkgcGFnZXMgYXJlIGNyZWF0ZWRcIilcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiQ2F0ZWdvcmllc1wiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYXRlZ29yaWVzRm9sZGVyKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNhdGVnb3JpZXNGb2xkZXIgPSB2YWx1ZSB8fCBcIkNhdGVnb3JpZXNcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkJhc2VzIGZvbGRlclwiKVxuICAgICAgLnNldERlc2MoXCJGb2xkZXIgd2hlcmUgYmFzZSBmaWxlcyBhcmUgY3JlYXRlZFwiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJUZW1wbGF0ZXMvQmFzZXNcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFzZXNGb2xkZXIpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFzZXNGb2xkZXIgPSB2YWx1ZSB8fCBcIlRlbXBsYXRlcy9CYXNlc1wiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRXhjbHVkZSBmb2xkZXJzXCIpXG4gICAgICAuc2V0RGVzYyhcIkZvbGRlcnMgdG8gZXhjbHVkZSBmcm9tIHByb2Nlc3NpbmcgKGNvbW1hLXNlcGFyYXRlZClcIilcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiVGVtcGxhdGVzLCBBcmNoaXZlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmV4Y2x1ZGVGb2xkZXJzLmpvaW4oXCIsIFwiKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5leGNsdWRlRm9sZGVycyA9IHZhbHVlXG4gICAgICAgICAgICAgIC5zcGxpdChcIixcIilcbiAgICAgICAgICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAgICAgICAgIC5maWx0ZXIoKHMpID0+IHMubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIC8vIEJlaGF2aW9yIFNlY3Rpb25cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJCZWhhdmlvclwiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlN5bmMgb24gc3RhcnR1cFwiKVxuICAgICAgLnNldERlc2MoXCJBdXRvbWF0aWNhbGx5IHN5bmMgYWxsIGNhdGVnb3JpZXMgd2hlbiBPYnNpZGlhbiBzdGFydHNcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bmNPblN0YXJ0dXApXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3luY09uU3RhcnR1cCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ2FzZSBzZW5zaXRpdmVcIilcbiAgICAgIC5zZXREZXNjKFwiVHJlYXQgJ1VybGF1YicgYW5kICd1cmxhdWInIGFzIGRpZmZlcmVudCBjYXRlZ29yaWVzXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYXNlU2Vuc2l0aXZlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNhc2VTZW5zaXRpdmUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgbm90aWZpY2F0aW9uc1wiKVxuICAgICAgLnNldERlc2MoXCJTaG93IG5vdGljZXMgd2hlbiBjYXRlZ29yaWVzIGFyZSBjcmVhdGVkXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93Tm90aWZpY2F0aW9ucylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93Tm90aWZpY2F0aW9ucyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTmVzdGVkIGNhdGVnb3J5IHNlcGFyYXRvclwiKVxuICAgICAgLnNldERlc2MoXCJTZXBhcmF0b3IgZm9yIG5lc3RlZCBjYXRlZ29yaWVzIChlLmcuLCBUcmF2ZWwvRXVyb3BlIGJlY29tZXMgVHJhdmVsIC0gRXVyb3BlKVwiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCIgLSBcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubmVzdGVkU2VwYXJhdG9yKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm5lc3RlZFNlcGFyYXRvciA9IHZhbHVlIHx8IFwiIC0gXCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIC8vIFRlbXBsYXRlIFNlY3Rpb25cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJCYXNlIFRlbXBsYXRlXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQmFzZSBmaWxlIHRlbXBsYXRlXCIpXG4gICAgICAuc2V0RGVzYyhcIlRlbXBsYXRlIGZvciBuZXcgLmJhc2UgZmlsZXMuIFVzZSB7e2NhdGVnb3J5TmFtZX19IGFzIHBsYWNlaG9sZGVyLlwiKVxuICAgICAgLmFkZFRleHRBcmVhKCh0ZXh0KSA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoREVGQVVMVF9CQVNFX1RFTVBMQVRFKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXNlVGVtcGxhdGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFzZVRlbXBsYXRlID0gdmFsdWUgfHwgREVGQVVMVF9CQVNFX1RFTVBMQVRFO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHRleHQuaW5wdXRFbC5yb3dzID0gMTU7XG4gICAgICAgIHRleHQuaW5wdXRFbC5jb2xzID0gNTA7XG4gICAgICB9KTtcblxuICAgIGNvbnN0IHJlc2V0QnRuID0gY29udGFpbmVyRWwuY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgICAgdGV4dDogXCJSZXNldCB0byBEZWZhdWx0IFRlbXBsYXRlXCIsXG4gICAgfSk7XG4gICAgcmVzZXRCdG4ub25jbGljayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmJhc2VUZW1wbGF0ZSA9IERFRkFVTFRfQkFTRV9URU1QTEFURTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgfTtcblxuICAgIC8vIENvbW1hbmRzIFNlY3Rpb25cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgzXCIsIHsgdGV4dDogXCJDb21tYW5kc1wiIH0pO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICB0ZXh0OiBcIlVzZSBDbWQrUCBhbmQgc2VhcmNoIGZvciAnQXV0byBDYXRlZ29yaWVzJyB0byBhY2Nlc3MgY29tbWFuZHM6XCIsXG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsaXN0ID0gY29udGFpbmVyRWwuY3JlYXRlRWwoXCJ1bFwiKTtcbiAgICBsaXN0LmNyZWF0ZUVsKFwibGlcIikuaW5uZXJIVE1MID1cbiAgICAgIFwiPHN0cm9uZz5TeW5jIEFsbCBDYXRlZ29yaWVzPC9zdHJvbmc+IC0gUHJvY2VzcyBhbGwgbm90ZXMgaW4gdmF1bHRcIjtcbiAgICBsaXN0LmNyZWF0ZUVsKFwibGlcIikuaW5uZXJIVE1MID1cbiAgICAgIFwiPHN0cm9uZz5Qcm9jZXNzIEN1cnJlbnQgRmlsZTwvc3Ryb25nPiAtIFByb2Nlc3Mgb25seSB0aGUgYWN0aXZlIG5vdGVcIjtcbiAgICBsaXN0LmNyZWF0ZUVsKFwibGlcIikuaW5uZXJIVE1MID1cbiAgICAgIFwiPHN0cm9uZz5TaG93IENhdGVnb3JpZXMgT3ZlcnZpZXc8L3N0cm9uZz4gLSBWaWV3IGFsbCBjYXRlZ29yaWVzXCI7XG4gICAgbGlzdC5jcmVhdGVFbChcImxpXCIpLmlubmVySFRNTCA9XG4gICAgICBcIjxzdHJvbmc+RmluZCBPcnBoYW4gQ2F0ZWdvcmllczwvc3Ryb25nPiAtIEZpbmQgdW51c2VkIGNhdGVnb3JpZXNcIjtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBVU87QUFhUCxJQUFNLHdCQUF3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBb0M5QixJQUFNLG1CQUEyQztBQUFBLEVBQy9DLGtCQUFrQjtBQUFBLEVBQ2xCLGFBQWE7QUFBQSxFQUNiLGdCQUFnQixDQUFDLFdBQVc7QUFBQSxFQUM1QixtQkFBbUI7QUFBQSxFQUNuQixlQUFlO0FBQUEsRUFDZixlQUFlO0FBQUEsRUFDZixpQkFBaUI7QUFBQSxFQUNqQixjQUFjO0FBQ2hCO0FBR0EsSUFBTSxnQkFBZ0I7QUFFdEIsSUFBcUIsdUJBQXJCLGNBQWtELHVCQUFPO0FBQUEsRUFBekQ7QUFBQTtBQUNFLG9CQUFtQztBQUFBO0FBQUEsRUFFbkMsTUFBTSxTQUFTO0FBQ2IsVUFBTSxLQUFLLGFBQWE7QUFHeEIsU0FBSyxjQUFjLElBQUkseUJBQXlCLEtBQUssS0FBSyxJQUFJLENBQUM7QUFHL0QsU0FBSztBQUFBLE1BQWM7QUFBQSxNQUFlO0FBQUEsTUFBdUIsTUFDdkQsS0FBSyxrQkFBa0I7QUFBQSxJQUN6QjtBQUdBLFNBQUssV0FBVztBQUFBLE1BQ2QsSUFBSTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sVUFBVSxNQUFNLEtBQUssa0JBQWtCO0FBQUEsSUFDekMsQ0FBQztBQUdELFNBQUssV0FBVztBQUFBLE1BQ2QsSUFBSTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sVUFBVSxNQUFNLEtBQUssbUJBQW1CO0FBQUEsSUFDMUMsQ0FBQztBQUdELFNBQUssV0FBVztBQUFBLE1BQ2QsSUFBSTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sVUFBVSxNQUFNLEtBQUssdUJBQXVCO0FBQUEsSUFDOUMsQ0FBQztBQUdELFNBQUssV0FBVztBQUFBLE1BQ2QsSUFBSTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sVUFBVSxNQUFNLEtBQUsscUJBQXFCO0FBQUEsSUFDNUMsQ0FBQztBQUdELFNBQUs7QUFBQSxNQUNILEtBQUssSUFBSSxjQUFjLEdBQUcsV0FBVyxDQUFDLFNBQWdCO0FBQ3BELGFBQUssWUFBWSxJQUFJO0FBQUEsTUFDdkIsQ0FBQztBQUFBLElBQ0g7QUFHQSxRQUFJLEtBQUssU0FBUyxlQUFlO0FBRS9CLFdBQUssSUFBSSxVQUFVLGNBQWMsTUFBTTtBQUNyQyxhQUFLLGtCQUFrQjtBQUFBLE1BQ3pCLENBQUM7QUFBQSxJQUNIO0FBRUEsWUFBUSxJQUFJLCtCQUErQjtBQUFBLEVBQzdDO0FBQUEsRUFFQSxXQUFXO0FBQ1QsWUFBUSxJQUFJLGlDQUFpQztBQUFBLEVBQy9DO0FBQUEsRUFFQSxNQUFNLGVBQWU7QUFDbkIsU0FBSyxXQUFXLE9BQU8sT0FBTyxDQUFDLEdBQUcsa0JBQWtCLE1BQU0sS0FBSyxTQUFTLENBQUM7QUFBQSxFQUMzRTtBQUFBLEVBRUEsTUFBTSxlQUFlO0FBQ25CLFVBQU0sS0FBSyxTQUFTLEtBQUssUUFBUTtBQUFBLEVBQ25DO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLUSxPQUFPLFNBQWlCO0FBQzlCLFFBQUksS0FBSyxTQUFTLG1CQUFtQjtBQUNuQyxVQUFJLHVCQUFPLE9BQU87QUFBQSxJQUNwQjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtRLGtCQUFrQixNQUFzQjtBQUM5QyxRQUFJLEtBQUssS0FBSyxXQUFXLEtBQUssU0FBUyxtQkFBbUIsR0FBRyxHQUFHO0FBQzlELGFBQU87QUFBQSxJQUNUO0FBRUEsZUFBVyxVQUFVLEtBQUssU0FBUyxnQkFBZ0I7QUFDakQsVUFBSSxVQUFVLEtBQUssS0FBSyxXQUFXLFNBQVMsR0FBRyxHQUFHO0FBQ2hELGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1RLG9CQUFvQixNQUFzQjtBQUNoRCxRQUFJLENBQUMsS0FBSyxTQUFTLEdBQUcsR0FBRztBQUN2QixhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU8sS0FBSyxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQUssRUFBRSxLQUFLLENBQUMsRUFBRSxLQUFLLEtBQUssU0FBUyxlQUFlO0FBQUEsRUFDOUU7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtRLHFCQUFxQixNQUkzQjtBQUVBLFFBQUksWUFBWSxLQUFLLG9CQUFvQixJQUFJO0FBQzdDLFVBQU0sVUFBVSxVQUFVLEtBQUs7QUFFL0IsUUFBSSxDQUFDLFNBQVM7QUFDWixhQUFPLEVBQUUsT0FBTyxPQUFPLFdBQVcsSUFBSSxPQUFPLHlCQUF5QjtBQUFBLElBQ3hFO0FBRUEsUUFBSSxjQUFjLEtBQUssT0FBTyxHQUFHO0FBQy9CLFlBQU0sWUFBWSxRQUFRLFFBQVEsZUFBZSxHQUFHO0FBQ3BELGFBQU87QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQO0FBQUEsUUFDQSxPQUFPLDBCQUEwQixPQUFPLG9CQUFvQixTQUFTO0FBQUEsTUFDdkU7QUFBQSxJQUNGO0FBRUEsV0FBTyxFQUFFLE9BQU8sTUFBTSxXQUFXLFFBQVE7QUFBQSxFQUMzQztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS1Esc0JBQXNCLFlBQWdDO0FBQzVELFVBQU0sT0FBTyxvQkFBSSxJQUFvQjtBQUVyQyxlQUFXLE9BQU8sWUFBWTtBQUM1QixZQUFNLE1BQU0sS0FBSyxTQUFTLGdCQUFnQixNQUFNLElBQUksWUFBWTtBQUNoRSxVQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsR0FBRztBQUNsQixhQUFLLElBQUksS0FBSyxHQUFHO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBRUEsV0FBTyxNQUFNLEtBQUssS0FBSyxPQUFPLENBQUM7QUFBQSxFQUNqQztBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxxQkFBcUI7QUFDekIsVUFBTSxhQUFhLEtBQUssSUFBSSxVQUFVLG9CQUFvQiw0QkFBWTtBQUN0RSxRQUFJLEVBQUMseUNBQVksT0FBTTtBQUNyQixVQUFJLHVCQUFPLGdCQUFnQjtBQUMzQjtBQUFBLElBQ0Y7QUFDQSxVQUFNLEtBQUssWUFBWSxXQUFXLElBQUk7QUFDdEMsU0FBSyxPQUFPLHNCQUFzQjtBQUFBLEVBQ3BDO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFlBQVksTUFBYTtBQUM3QixRQUFJO0FBQ0YsVUFBSSxLQUFLLGtCQUFrQixJQUFJLEdBQUc7QUFDaEM7QUFBQSxNQUNGO0FBRUEsWUFBTSxXQUFXLEtBQUssSUFBSSxjQUFjLGFBQWEsSUFBSTtBQUN6RCxZQUFNLGNBQWMscUNBQVU7QUFFOUIsVUFBSSxFQUFDLDJDQUFhLFlBQVk7QUFFOUIsVUFBSSxhQUFhLFlBQVk7QUFDN0IsVUFBSSxDQUFDLE1BQU0sUUFBUSxVQUFVLEdBQUc7QUFDOUIscUJBQWEsQ0FBQyxVQUFVO0FBQUEsTUFDMUI7QUFFQSxZQUFNLHNCQUFnQyxDQUFDO0FBQ3ZDLFVBQUksY0FBYztBQUNsQixZQUFNLFdBQXFCLENBQUM7QUFFNUIsaUJBQVcsT0FBTyxZQUFZO0FBQzVCLGNBQU0sU0FBUyxPQUFPLEdBQUc7QUFDekIsY0FBTSxRQUFRLE9BQU8sTUFBTSxvQkFBb0I7QUFFL0MsWUFBSTtBQUVKLFlBQUksT0FBTztBQUNULHlCQUFlLE1BQU0sQ0FBQztBQUFBLFFBQ3hCLFdBQVcsT0FBTyxLQUFLLEdBQUc7QUFDeEIseUJBQWUsT0FBTyxLQUFLO0FBQzNCLHdCQUFjO0FBQUEsUUFDaEIsT0FBTztBQUNMO0FBQUEsUUFDRjtBQUdBLGNBQU0sYUFBYSxLQUFLLHFCQUFxQixZQUFZO0FBQ3pELFlBQUksQ0FBQyxXQUFXLFNBQVMsV0FBVyxPQUFPO0FBQ3pDLG1CQUFTLEtBQUssV0FBVyxLQUFLO0FBQUEsUUFDaEM7QUFFQSx1QkFBZSxXQUFXO0FBRzFCLFlBQUksaUJBQWlCLE9BQU8sS0FBSyxLQUFLLGtCQUFpQiwrQkFBUSxLQUFJO0FBQ2pFLHdCQUFjO0FBQUEsUUFDaEI7QUFFQSxZQUFJLGNBQWM7QUFDaEIsOEJBQW9CLEtBQUssWUFBWTtBQUFBLFFBQ3ZDO0FBQUEsTUFDRjtBQUdBLFlBQU0sbUJBQW1CLEtBQUssc0JBQXNCLG1CQUFtQjtBQUV2RSxVQUFJLGlCQUFpQixXQUFXLG9CQUFvQixRQUFRO0FBQzFELHNCQUFjO0FBQUEsTUFDaEI7QUFHQSxpQkFBVyxXQUFXLFVBQVU7QUFDOUIsWUFBSSx1QkFBTyxPQUFPO0FBQUEsTUFDcEI7QUFHQSxVQUFJLGFBQWE7QUFDZixjQUFNLHNCQUFzQixpQkFBaUIsSUFBSSxDQUFDLE1BQU0sTUFBTSxDQUFDLEtBQUs7QUFDcEUsY0FBTSxLQUFLLDRCQUE0QixNQUFNLG1CQUFtQjtBQUFBLE1BQ2xFO0FBR0EsaUJBQVcsZ0JBQWdCLGtCQUFrQjtBQUMzQyxjQUFNLEtBQUsscUJBQXFCLFlBQVk7QUFBQSxNQUM5QztBQUFBLElBQ0YsU0FBUyxPQUFPO0FBQ2QsY0FBUSxNQUFNLDBDQUEwQyxLQUFLO0FBQzdELFVBQUksdUJBQU8sb0JBQW9CLEtBQUssSUFBSSxLQUFLLEtBQUssRUFBRTtBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSw0QkFBNEIsTUFBYSxlQUF5QjtBQUN0RSxRQUFJO0FBQ0YsWUFBTSxVQUFVLE1BQU0sS0FBSyxJQUFJLE1BQU0sS0FBSyxJQUFJO0FBQzlDLFlBQU0sUUFBUSxRQUFRLE1BQU0sSUFBSTtBQUVoQyxVQUFJLE1BQU0sQ0FBQyxNQUFNLE1BQU87QUFFeEIsVUFBSSxpQkFBaUI7QUFDckIsZUFBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUNyQyxZQUFJLE1BQU0sQ0FBQyxNQUFNLE9BQU87QUFDdEIsMkJBQWlCO0FBQ2pCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFFQSxVQUFJLG1CQUFtQixHQUFJO0FBRTNCLFVBQUksZUFBZTtBQUNuQixVQUFJLHNCQUFzQjtBQUMxQixVQUFJLG9CQUFvQjtBQUV4QixlQUFTLElBQUksR0FBRyxJQUFJLGdCQUFnQixLQUFLO0FBQ3ZDLGNBQU0sT0FBTyxNQUFNLENBQUM7QUFFcEIsWUFBSSxLQUFLLE1BQU0sa0JBQWtCLEdBQUc7QUFDbEMseUJBQWU7QUFDZixnQ0FBc0I7QUFBQSxRQUN4QixXQUFXLEtBQUssTUFBTSxtQkFBbUIsR0FBRztBQUMxQyxnQ0FBc0I7QUFDdEIsOEJBQW9CO0FBQ3BCO0FBQUEsUUFDRixXQUFXLGNBQWM7QUFDdkIsY0FBSSxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQ3pCLGdDQUFvQjtBQUFBLFVBQ3RCLFdBQVcsQ0FBQyxLQUFLLE1BQU0sT0FBTyxHQUFHO0FBQy9CO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBRUEsVUFBSSx3QkFBd0IsR0FBSTtBQUVoQyxZQUFNLHFCQUFxQixDQUFDLGFBQWE7QUFDekMsaUJBQVcsT0FBTyxlQUFlO0FBQy9CLDJCQUFtQixLQUFLLE9BQU8sR0FBRyxFQUFFO0FBQUEsTUFDdEM7QUFFQSxZQUFNLFdBQVc7QUFBQSxRQUNmLEdBQUcsTUFBTSxNQUFNLEdBQUcsbUJBQW1CO0FBQUEsUUFDckMsR0FBRztBQUFBLFFBQ0gsR0FBRyxNQUFNLE1BQU0sb0JBQW9CLENBQUM7QUFBQSxNQUN0QztBQUVBLFlBQU0sS0FBSyxJQUFJLE1BQU0sT0FBTyxNQUFNLFNBQVMsS0FBSyxJQUFJLENBQUM7QUFBQSxJQUN2RCxTQUFTLE9BQU87QUFDZCxjQUFRLE1BQU0sK0NBQStDLEtBQUs7QUFDbEUsWUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLHFCQUFxQixjQUFzQjtBQUMvQyxVQUFNLGVBQWUsR0FBRyxLQUFLLFNBQVMsZ0JBQWdCLElBQUksWUFBWTtBQUN0RSxVQUFNLFdBQVcsR0FBRyxLQUFLLFNBQVMsV0FBVyxJQUFJLFlBQVk7QUFFN0QsUUFBSTtBQUNGLFlBQU0sS0FBSyxtQkFBbUIsS0FBSyxTQUFTLGdCQUFnQjtBQUM1RCxZQUFNLEtBQUssbUJBQW1CLEtBQUssU0FBUyxXQUFXO0FBRXZELFVBQUksQ0FBQyxLQUFLLElBQUksTUFBTSxzQkFBc0IsWUFBWSxHQUFHO0FBQ3ZELGNBQU0sa0JBQWtCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUszQixZQUFZO0FBQUE7QUFFVCxjQUFNLEtBQUssSUFBSSxNQUFNLE9BQU8sY0FBYyxlQUFlO0FBQ3pELGFBQUssT0FBTyxxQkFBcUIsWUFBWSxFQUFFO0FBQUEsTUFDakQ7QUFFQSxVQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sc0JBQXNCLFFBQVEsR0FBRztBQUNuRCxjQUFNLGNBQWMsS0FBSyxvQkFBb0IsWUFBWTtBQUN6RCxjQUFNLEtBQUssSUFBSSxNQUFNLE9BQU8sVUFBVSxXQUFXO0FBQUEsTUFDbkQ7QUFBQSxJQUNGLFNBQVMsT0FBTztBQUNkLGNBQVE7QUFBQSxRQUNOLDZDQUE2QyxZQUFZO0FBQUEsUUFDekQ7QUFBQSxNQUNGO0FBQ0EsVUFBSSx1QkFBTyw0QkFBNEIsWUFBWSxNQUFNLEtBQUssRUFBRTtBQUFBLElBQ2xFO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxtQkFBbUIsWUFBb0I7QUFDM0MsVUFBTSxRQUFRLFdBQVcsTUFBTSxHQUFHO0FBQ2xDLFFBQUksY0FBYztBQUVsQixlQUFXLFFBQVEsT0FBTztBQUN4QixvQkFBYyxjQUFjLEdBQUcsV0FBVyxJQUFJLElBQUksS0FBSztBQUN2RCxZQUFNLFNBQVMsS0FBSyxJQUFJLE1BQU0sc0JBQXNCLFdBQVc7QUFDL0QsVUFBSSxDQUFDLFFBQVE7QUFDWCxZQUFJO0FBQ0YsZ0JBQU0sS0FBSyxJQUFJLE1BQU0sYUFBYSxXQUFXO0FBQUEsUUFDL0MsU0FBUyxPQUFPO0FBQ2QsY0FBSSxDQUFDLEtBQUssSUFBSSxNQUFNLHNCQUFzQixXQUFXLEdBQUc7QUFDdEQsa0JBQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0Esb0JBQW9CLGNBQThCO0FBQ2hELFdBQU8sS0FBSyxTQUFTLGFBQWEsUUFBUSx5QkFBeUIsWUFBWSxJQUFJO0FBQUEsRUFDckY7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLHVCQUFvQztBQUNsQyxVQUFNLGdCQUFnQixvQkFBSSxJQUFZO0FBQ3RDLFVBQU0sV0FBVyxLQUFLLElBQUksTUFBTSxpQkFBaUI7QUFFakQsZUFBVyxRQUFRLFVBQVU7QUFDM0IsVUFBSSxLQUFLLGtCQUFrQixJQUFJLEVBQUc7QUFFbEMsWUFBTSxXQUFXLEtBQUssSUFBSSxjQUFjLGFBQWEsSUFBSTtBQUN6RCxZQUFNLGNBQWMscUNBQVU7QUFFOUIsVUFBSSxFQUFDLDJDQUFhLFlBQVk7QUFFOUIsVUFBSSxhQUFhLFlBQVk7QUFDN0IsVUFBSSxDQUFDLE1BQU0sUUFBUSxVQUFVLEdBQUc7QUFDOUIscUJBQWEsQ0FBQyxVQUFVO0FBQUEsTUFDMUI7QUFFQSxpQkFBVyxPQUFPLFlBQVk7QUFDNUIsY0FBTSxTQUFTLE9BQU8sR0FBRztBQUN6QixjQUFNLFFBQVEsT0FBTyxNQUFNLGtCQUFrQjtBQUU3QyxZQUFJLE9BQU87QUFDVCx3QkFBYyxJQUFJLE1BQU0sQ0FBQyxDQUFDO0FBQUEsUUFDNUIsV0FBVyxPQUFPLEtBQUssR0FBRztBQUN4Qix3QkFBYyxJQUFJLEtBQUssb0JBQW9CLE9BQU8sS0FBSyxDQUFDLENBQUM7QUFBQSxRQUMzRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUEsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLDJCQUFxQztBQUNuQyxVQUFNLG1CQUFtQixLQUFLLElBQUksTUFBTTtBQUFBLE1BQ3RDLEtBQUssU0FBUztBQUFBLElBQ2hCO0FBRUEsUUFBSSxDQUFDLG9CQUFvQixFQUFFLDRCQUE0QiwwQkFBVTtBQUMvRCxhQUFPLENBQUM7QUFBQSxJQUNWO0FBRUEsVUFBTSxhQUF1QixDQUFDO0FBRTlCLFVBQU0sZ0JBQWdCLENBQUMsV0FBb0I7QUFDekMsaUJBQVcsU0FBUyxPQUFPLFVBQVU7QUFDbkMsWUFBSSxpQkFBaUIseUJBQVMsTUFBTSxjQUFjLE1BQU07QUFDdEQscUJBQVcsS0FBSyxNQUFNLFFBQVE7QUFBQSxRQUNoQyxXQUFXLGlCQUFpQix5QkFBUztBQUNuQyx3QkFBYyxLQUFLO0FBQUEsUUFDckI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUVBLGtCQUFjLGdCQUFnQjtBQUM5QixXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EseUJBQXlCO0FBQ3ZCLFVBQU0saUJBQWlCLEtBQUsscUJBQXFCO0FBQ2pELFVBQU0scUJBQXFCLEtBQUsseUJBQXlCO0FBRXpELFFBQUk7QUFBQSxNQUNGLEtBQUs7QUFBQSxNQUNMLE1BQU0sS0FBSyxjQUFjLEVBQUUsS0FBSztBQUFBLE1BQ2hDLG1CQUFtQixLQUFLO0FBQUEsSUFDMUIsRUFBRSxLQUFLO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsdUJBQXVCO0FBQ3JCLFVBQU0saUJBQWlCLEtBQUsscUJBQXFCO0FBQ2pELFVBQU0scUJBQXFCLEtBQUsseUJBQXlCO0FBRXpELFVBQU0sVUFBVSxtQkFBbUI7QUFBQSxNQUNqQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLElBQUksR0FBRztBQUFBLElBQ2xDO0FBRUEsUUFBSSxRQUFRLFdBQVcsR0FBRztBQUN4QixVQUFJLHVCQUFPLDZCQUE2QjtBQUN4QztBQUFBLElBQ0Y7QUFFQSxRQUFJLHNCQUFzQixLQUFLLEtBQUssTUFBTSxPQUFPLEVBQUUsS0FBSztBQUFBLEVBQzFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLGVBQWUsY0FBc0I7QUFDekMsVUFBTSxlQUFlLEdBQUcsS0FBSyxTQUFTLGdCQUFnQixJQUFJLFlBQVk7QUFDdEUsVUFBTSxXQUFXLEdBQUcsS0FBSyxTQUFTLFdBQVcsSUFBSSxZQUFZO0FBRTdELFFBQUk7QUFDRixZQUFNLGVBQWUsS0FBSyxJQUFJLE1BQU0sc0JBQXNCLFlBQVk7QUFDdEUsVUFBSSxjQUFjO0FBQ2hCLGNBQU0sS0FBSyxJQUFJLE1BQU0sT0FBTyxZQUFZO0FBQUEsTUFDMUM7QUFFQSxZQUFNLFdBQVcsS0FBSyxJQUFJLE1BQU0sc0JBQXNCLFFBQVE7QUFDOUQsVUFBSSxVQUFVO0FBQ1osY0FBTSxLQUFLLElBQUksTUFBTSxPQUFPLFFBQVE7QUFBQSxNQUN0QztBQUVBLFdBQUssT0FBTyxxQkFBcUIsWUFBWSxFQUFFO0FBQUEsSUFDakQsU0FBUyxPQUFPO0FBQ2QsVUFBSSx1QkFBTyw0QkFBNEIsS0FBSyxFQUFFO0FBQUEsSUFDaEQ7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLG9CQUFvQjtBQUN4QixVQUFNLFdBQVcsS0FBSyxJQUFJLE1BQU0saUJBQWlCO0FBQ2pELFFBQUksaUJBQWlCO0FBQ3JCLFVBQU0sZ0JBQWdCLG9CQUFJLElBQVk7QUFDdEMsUUFBSSxhQUFhO0FBRWpCLGVBQVcsUUFBUSxVQUFVO0FBQzNCLFVBQUksS0FBSyxrQkFBa0IsSUFBSSxHQUFHO0FBQ2hDO0FBQUEsTUFDRjtBQUVBLFlBQU0sV0FBVyxLQUFLLElBQUksY0FBYyxhQUFhLElBQUk7QUFDekQsWUFBTSxjQUFjLHFDQUFVO0FBRTlCLFVBQUksRUFBQywyQ0FBYSxZQUFZO0FBRTlCLFVBQUksYUFBYSxZQUFZO0FBQzdCLFVBQUksQ0FBQyxNQUFNLFFBQVEsVUFBVSxHQUFHO0FBQzlCLHFCQUFhLENBQUMsVUFBVTtBQUFBLE1BQzFCO0FBRUEsaUJBQVcsT0FBTyxZQUFZO0FBQzVCLGNBQU0sU0FBUyxPQUFPLEdBQUc7QUFDekIsY0FBTSxRQUFRLE9BQU8sTUFBTSxrQkFBa0I7QUFFN0MsWUFBSSxPQUFPO0FBQ1Qsd0JBQWMsSUFBSSxNQUFNLENBQUMsQ0FBQztBQUFBLFFBQzVCLFdBQVcsT0FBTyxLQUFLLEdBQUc7QUFDeEIsd0JBQWMsSUFBSSxLQUFLLG9CQUFvQixPQUFPLEtBQUssQ0FBQyxDQUFDO0FBQUEsUUFDM0Q7QUFBQSxNQUNGO0FBRUEsVUFBSTtBQUNGLGNBQU0sS0FBSyxZQUFZLElBQUk7QUFDM0I7QUFBQSxNQUNGLFNBQVMsT0FBTztBQUNkO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFFQSxRQUFJLFVBQVUsVUFBVSxjQUFjLElBQUksb0JBQW9CLGNBQWM7QUFDNUUsUUFBSSxhQUFhLEdBQUc7QUFDbEIsaUJBQVcsS0FBSyxVQUFVO0FBQUEsSUFDNUI7QUFDQSxRQUFJLHVCQUFPLE9BQU87QUFBQSxFQUNwQjtBQUNGO0FBS0EsSUFBTSwwQkFBTixjQUFzQyxzQkFBTTtBQUFBLEVBSTFDLFlBQVksS0FBVSxnQkFBMEIsb0JBQThCO0FBQzVFLFVBQU0sR0FBRztBQUNULFNBQUssaUJBQWlCO0FBQ3RCLFNBQUsscUJBQXFCO0FBQUEsRUFDNUI7QUFBQSxFQUVBLFNBQVM7QUFDUCxVQUFNLEVBQUUsVUFBVSxJQUFJO0FBQ3RCLGNBQVUsTUFBTTtBQUVoQixjQUFVLFNBQVMsTUFBTSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHeEQsVUFBTSxVQUFVLFVBQVUsVUFBVSxFQUFFLEtBQUssd0JBQXdCLENBQUM7QUFDcEUsWUFBUSxTQUFTLEtBQUs7QUFBQSxNQUNwQixNQUFNLGtCQUFrQixLQUFLLGVBQWUsTUFBTTtBQUFBLElBQ3BELENBQUM7QUFDRCxZQUFRLFNBQVMsS0FBSztBQUFBLE1BQ3BCLE1BQU0sbUJBQW1CLEtBQUssbUJBQW1CLE1BQU07QUFBQSxJQUN6RCxDQUFDO0FBR0QsY0FBVSxTQUFTLE1BQU0sRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELFVBQU0sV0FBVyxVQUFVLFNBQVMsSUFBSTtBQUN4QyxlQUFXLE9BQU8sS0FBSyxnQkFBZ0I7QUFDckMsWUFBTSxLQUFLLFNBQVMsU0FBUyxJQUFJO0FBQ2pDLFNBQUcsU0FBUyxRQUFRLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDakMsVUFBSSxDQUFDLEtBQUssbUJBQW1CLFNBQVMsR0FBRyxHQUFHO0FBQzFDLFdBQUcsU0FBUyxRQUFRO0FBQUEsVUFDbEIsTUFBTTtBQUFBLFVBQ04sS0FBSztBQUFBLFFBQ1AsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBR0EsVUFBTSxVQUFVLEtBQUssbUJBQW1CO0FBQUEsTUFDdEMsQ0FBQyxRQUFRLENBQUMsS0FBSyxlQUFlLFNBQVMsR0FBRztBQUFBLElBQzVDO0FBQ0EsUUFBSSxRQUFRLFNBQVMsR0FBRztBQUN0QixnQkFBVSxTQUFTLE1BQU0sRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQy9ELFlBQU0sYUFBYSxVQUFVLFNBQVMsSUFBSTtBQUMxQyxpQkFBVyxPQUFPLFNBQVM7QUFDekIsbUJBQVcsU0FBUyxNQUFNLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFHQSxjQUFVLFNBQVMsU0FBUztBQUFBLE1BQzFCLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS1IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLFVBQVU7QUFDUixTQUFLLFVBQVUsTUFBTTtBQUFBLEVBQ3ZCO0FBQ0Y7QUFLQSxJQUFNLHdCQUFOLGNBQW9DLHNCQUFNO0FBQUEsRUFJeEMsWUFBWSxLQUFVLFFBQThCLFNBQW1CO0FBQ3JFLFVBQU0sR0FBRztBQUNULFNBQUssU0FBUztBQUNkLFNBQUssVUFBVTtBQUFBLEVBQ2pCO0FBQUEsRUFFQSxTQUFTO0FBQ1AsVUFBTSxFQUFFLFVBQVUsSUFBSTtBQUN0QixjQUFVLE1BQU07QUFFaEIsY0FBVSxTQUFTLE1BQU0sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELGNBQVUsU0FBUyxLQUFLO0FBQUEsTUFDdEIsTUFBTSxTQUFTLEtBQUssUUFBUSxNQUFNO0FBQUEsSUFDcEMsQ0FBQztBQUVELFVBQU0sT0FBTyxVQUFVLFNBQVMsSUFBSTtBQUNwQyxlQUFXLE9BQU8sS0FBSyxTQUFTO0FBQzlCLFlBQU0sS0FBSyxLQUFLLFNBQVMsSUFBSTtBQUM3QixTQUFHLFNBQVMsUUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBRWpDLFlBQU0sWUFBWSxHQUFHLFNBQVMsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzFELGdCQUFVLE1BQU0sYUFBYTtBQUM3QixnQkFBVSxVQUFVLFlBQVk7QUFDOUIsY0FBTSxLQUFLLE9BQU8sZUFBZSxHQUFHO0FBQ3BDLFdBQUcsT0FBTztBQUNWLGFBQUssVUFBVSxLQUFLLFFBQVEsT0FBTyxDQUFDLE1BQU0sTUFBTSxHQUFHO0FBQ25ELFlBQUksS0FBSyxRQUFRLFdBQVcsR0FBRztBQUM3QixlQUFLLE1BQU07QUFBQSxRQUNiO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFHQSxRQUFJLEtBQUssUUFBUSxTQUFTLEdBQUc7QUFDM0IsWUFBTSxlQUFlLFVBQVUsU0FBUyxVQUFVO0FBQUEsUUFDaEQsTUFBTTtBQUFBLE1BQ1IsQ0FBQztBQUNELG1CQUFhLE1BQU0sWUFBWTtBQUMvQixtQkFBYSxVQUFVLFlBQVk7QUFDakMsbUJBQVcsT0FBTyxDQUFDLEdBQUcsS0FBSyxPQUFPLEdBQUc7QUFDbkMsZ0JBQU0sS0FBSyxPQUFPLGVBQWUsR0FBRztBQUFBLFFBQ3RDO0FBQ0EsYUFBSyxNQUFNO0FBQUEsTUFDYjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxVQUFVO0FBQ1IsU0FBSyxVQUFVLE1BQU07QUFBQSxFQUN2QjtBQUNGO0FBS0EsSUFBTSwyQkFBTixjQUF1QyxpQ0FBaUI7QUFBQSxFQUd0RCxZQUFZLEtBQVUsUUFBOEI7QUFDbEQsVUFBTSxLQUFLLE1BQU07QUFDakIsU0FBSyxTQUFTO0FBQUEsRUFDaEI7QUFBQSxFQUVBLFVBQWdCO0FBQ2QsVUFBTSxFQUFFLFlBQVksSUFBSTtBQUN4QixnQkFBWSxNQUFNO0FBRWxCLGdCQUFZLFNBQVMsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHL0QsZ0JBQVksU0FBUyxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFOUMsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsbUJBQW1CLEVBQzNCLFFBQVEseUNBQXlDLEVBQ2pEO0FBQUEsTUFBUSxDQUFDLFNBQ1IsS0FDRyxlQUFlLFlBQVksRUFDM0IsU0FBUyxLQUFLLE9BQU8sU0FBUyxnQkFBZ0IsRUFDOUMsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsbUJBQW1CLFNBQVM7QUFDakQsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUFBLE1BQ2pDLENBQUM7QUFBQSxJQUNMO0FBRUYsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsY0FBYyxFQUN0QixRQUFRLHFDQUFxQyxFQUM3QztBQUFBLE1BQVEsQ0FBQyxTQUNSLEtBQ0csZUFBZSxpQkFBaUIsRUFDaEMsU0FBUyxLQUFLLE9BQU8sU0FBUyxXQUFXLEVBQ3pDLFNBQVMsT0FBTyxVQUFVO0FBQ3pCLGFBQUssT0FBTyxTQUFTLGNBQWMsU0FBUztBQUM1QyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQUEsTUFDakMsQ0FBQztBQUFBLElBQ0w7QUFFRixRQUFJLHdCQUFRLFdBQVcsRUFDcEIsUUFBUSxpQkFBaUIsRUFDekIsUUFBUSxzREFBc0QsRUFDOUQ7QUFBQSxNQUFRLENBQUMsU0FDUixLQUNHLGVBQWUsb0JBQW9CLEVBQ25DLFNBQVMsS0FBSyxPQUFPLFNBQVMsZUFBZSxLQUFLLElBQUksQ0FBQyxFQUN2RCxTQUFTLE9BQU8sVUFBVTtBQUN6QixhQUFLLE9BQU8sU0FBUyxpQkFBaUIsTUFDbkMsTUFBTSxHQUFHLEVBQ1QsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFDbkIsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7QUFDN0IsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUFBLE1BQ2pDLENBQUM7QUFBQSxJQUNMO0FBR0YsZ0JBQVksU0FBUyxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFL0MsUUFBSSx3QkFBUSxXQUFXLEVBQ3BCLFFBQVEsaUJBQWlCLEVBQ3pCLFFBQVEsd0RBQXdELEVBQ2hFO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FDRyxTQUFTLEtBQUssT0FBTyxTQUFTLGFBQWEsRUFDM0MsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsZ0JBQWdCO0FBQ3JDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFBQSxNQUNqQyxDQUFDO0FBQUEsSUFDTDtBQUVGLFFBQUksd0JBQVEsV0FBVyxFQUNwQixRQUFRLGdCQUFnQixFQUN4QixRQUFRLHFEQUFxRCxFQUM3RDtBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQ0csU0FBUyxLQUFLLE9BQU8sU0FBUyxhQUFhLEVBQzNDLFNBQVMsT0FBTyxVQUFVO0FBQ3pCLGFBQUssT0FBTyxTQUFTLGdCQUFnQjtBQUNyQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQUEsTUFDakMsQ0FBQztBQUFBLElBQ0w7QUFFRixRQUFJLHdCQUFRLFdBQVcsRUFDcEIsUUFBUSxvQkFBb0IsRUFDNUIsUUFBUSwwQ0FBMEMsRUFDbEQ7QUFBQSxNQUFVLENBQUMsV0FDVixPQUNHLFNBQVMsS0FBSyxPQUFPLFNBQVMsaUJBQWlCLEVBQy9DLFNBQVMsT0FBTyxVQUFVO0FBQ3pCLGFBQUssT0FBTyxTQUFTLG9CQUFvQjtBQUN6QyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQUEsTUFDakMsQ0FBQztBQUFBLElBQ0w7QUFFRixRQUFJLHdCQUFRLFdBQVcsRUFDcEIsUUFBUSwyQkFBMkIsRUFDbkMsUUFBUSwrRUFBK0UsRUFDdkY7QUFBQSxNQUFRLENBQUMsU0FDUixLQUNHLGVBQWUsS0FBSyxFQUNwQixTQUFTLEtBQUssT0FBTyxTQUFTLGVBQWUsRUFDN0MsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsa0JBQWtCLFNBQVM7QUFDaEQsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUFBLE1BQ2pDLENBQUM7QUFBQSxJQUNMO0FBR0YsZ0JBQVksU0FBUyxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxRQUFJLHdCQUFRLFdBQVcsRUFDcEIsUUFBUSxvQkFBb0IsRUFDNUIsUUFBUSxvRUFBb0UsRUFDNUUsWUFBWSxDQUFDLFNBQVM7QUFDckIsV0FDRyxlQUFlLHFCQUFxQixFQUNwQyxTQUFTLEtBQUssT0FBTyxTQUFTLFlBQVksRUFDMUMsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsZUFBZSxTQUFTO0FBQzdDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFBQSxNQUNqQyxDQUFDO0FBQ0gsV0FBSyxRQUFRLE9BQU87QUFDcEIsV0FBSyxRQUFRLE9BQU87QUFBQSxJQUN0QixDQUFDO0FBRUgsVUFBTSxXQUFXLFlBQVksU0FBUyxVQUFVO0FBQUEsTUFDOUMsTUFBTTtBQUFBLElBQ1IsQ0FBQztBQUNELGFBQVMsVUFBVSxZQUFZO0FBQzdCLFdBQUssT0FBTyxTQUFTLGVBQWU7QUFDcEMsWUFBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixXQUFLLFFBQVE7QUFBQSxJQUNmO0FBR0EsZ0JBQVksU0FBUyxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDL0MsZ0JBQVksU0FBUyxLQUFLO0FBQUEsTUFDeEIsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLElBQ1AsQ0FBQztBQUVELFVBQU0sT0FBTyxZQUFZLFNBQVMsSUFBSTtBQUN0QyxTQUFLLFNBQVMsSUFBSSxFQUFFLFlBQ2xCO0FBQ0YsU0FBSyxTQUFTLElBQUksRUFBRSxZQUNsQjtBQUNGLFNBQUssU0FBUyxJQUFJLEVBQUUsWUFDbEI7QUFDRixTQUFLLFNBQVMsSUFBSSxFQUFFLFlBQ2xCO0FBQUEsRUFDSjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
