import * as u from "@/utils/utilFunctions"
import {remote as electron} from "electron"
import fs from "fs-extra"

class Store {
  private dir
  private _tags: string[] = []
  private _items: Item[] = []
  dirSet = false

  get tags() {
    return this._tags
  }

  get items() {
    return this._items
  }

  private get dbFile() {
    return this.dir + "magius-db.json"
  }

  private get trashDir() {
    return this.dir + "magius-trash/"
  }

  private static supportedFiletype(filename: string) {
    return RegExp("^.*\.(jpe?g|a?png|gif|webp|svg)$", "i").test(filename)
  }


  async load(dir: null | string = null) {
    // select directory
    if (!dir)
      dir = (await electron.dialog.showOpenDialog(
        electron.getCurrentWindow(),
        {properties: ["openDirectory"]},
      )).filePaths[0] + "/"
    if (!dir) return
    this.dir = dir
    localStorage.setItem("lastDir", dir)

    // load db
    let db: { tags: string[], items: Item[] } = {tags: [], items: []}
    if (await fs.pathExists(this.dbFile))
      db = JSON.parse(await fs.readFile(this.dbFile, "utf8"))

    // load tags
    this._tags = db.tags

    // load items
    let timestampOffset = 1
    this._items = (await fs.readdir(this.dir))
      .filter(Store.supportedFiletype)
      .map((filename, i) => ({
        filename,
        timestamp: db.items.find(x => x.filename === filename)?.timestamp ?? Date.now() + (timestampOffset++ * 0.001),
        tags: db.items.find(x => x.filename === filename)?.tags ?? [],
        path: this.dir + "/" + filename,
        url: "file:///" + this.dir + filename,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)

    this.dirSet = true
  }

  async reload() {
    await this.load(this.dir)
  }

  async save() {
    await fs.writeFile(this.dbFile, JSON.stringify({
      tags: this._tags,
      items: this._items.map(x => ({
        filename: x.filename,
        timestamp: x.timestamp,
        tags: x.tags,
      })),
    }))
    console.log("magius-db.json updated")
  }

  async addTags(items: Item[], tags: string[]) {
    items.forEach(item => {
      tags.forEach(tag => {
        u.addUnique(item.tags, tag)
        u.addUnique(this._tags, tag)
      })
      item.tags.sort()
    })
    this._tags.sort()
    await this.save()
  }

  async removeTags(items: Item[], tags: string[]) {
    items.forEach(x => u.remove(x.tags, tags))
    await this.save()
  }

  async renameTags(tagMap: [string, string][]) {
    tagMap.forEach(([oldTag, newTag]) => {
      u.remove(this._tags, oldTag)
      u.addUnique(this._tags, newTag)
      this.items
        .filter(item => item.tags.includes(oldTag))
        .forEach(item => {
          u.remove(item.tags, oldTag)
          u.addUnique(item.tags, newTag)
        })
    })
    await this.save()
    // if renamed to same name as another existing tag, a merge will happen
  }

  async destroyTags(tags: string[]) {
    u.remove(this._tags, tags)
    this.items.forEach(x => u.remove(x.tags, tags))
    await this.save()
  }

  async destroyItems(items: Item[]) {
    await Promise.all(items.map(async (item) => {
      u.remove(this._items, item)
      await fs.ensureDir(this.trashDir)
      await fs.rename(item.path, this.trashDir + item.filename)
    }))
    await this.save()
    // maybe add a trash view in a later version
  }

  async importItems(files: File[]) {
    files = files.filter(x => Store.supportedFiletype(x.name))
    await Promise.all(files.map(x => fs.copy(x.path, this.dir + x.name)))
    await this.reload()
    await this.save()
  }
}

export default new Store()
