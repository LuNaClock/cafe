// src/models/Tag.js
class Tag {
  constructor(tagData = {}) {
    this.id = tagData.id || crypto.randomUUID();
    this.name = tagData.name || '';
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name
    };
  }

  static fromJSON(json) {
    return new Tag(json);
  }
}

export default Tag;