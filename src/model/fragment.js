// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

// Define a map for the valid conversions of types to file extensions
const typeExtensionMap = new Map();
typeExtensionMap.set('text/plain', ['txt']);
typeExtensionMap.set('text/markdown', ['md', 'html', 'txt']);
typeExtensionMap.set('text/html', ['html', 'txt']);
typeExtensionMap.set('application/json', ['json', 'txt']);
typeExtensionMap.set('image/png', ['png', 'jpg', 'webp', 'gif']);
typeExtensionMap.set('image/jpeg', ['png', 'jpg', 'webp', 'gif']);
typeExtensionMap.set('image/webp', ['png', 'jpg', 'webp', 'gif']);
typeExtensionMap.set('image/gif', ['png', 'jpg', 'webp', 'gif']);

const typeConversionMap = new Map();
typeConversionMap.set('text/plain', ['text/plain']);
typeConversionMap.set('text/markdown', ['text/plain', 'text/html', 'text/markdown']);
typeConversionMap.set('text/html', ['text/plain', 'text/html']);
typeConversionMap.set('application/json', ['text/plain', 'application/json']);
typeConversionMap.set('image/png', ['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
typeConversionMap.set('image/jpeg', ['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
typeConversionMap.set('image/webp', ['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
typeConversionMap.set('image/gif', ['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) {
      throw new Error('ownerId is required');
    }
    if (!type) {
      throw new Error('type is required');
    }
    if (typeof size !== 'number') {
      throw new Error('size must be a number');
    }
    if (size < 0) {
      throw new Error('size must be greater than or equal to 0');
    }
    if (!typeConversionMap.get(contentType.parse(type).type)) {
      throw new Error(`${type} is not a valid type`);
    }
    if (!id) {
      this.id = String(randomUUID());
    } else {
      this.id = id;
    }
    this.ownerId = ownerId;
    if (!created) {
      this.created = new Date().toISOString();
    } else {
      this.created = created;
    }
    if (!updated) {
      this.updated = new Date().toISOString();
    } else {
      this.updated = updated;
    }
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const result = await readFragment(ownerId, id);
    if (!result) {
      throw new Error(`fragment with id ${id} and ownerId ${ownerId} not found`);
    }
    return new Fragment(result);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data) {
      throw new Error('require data to set data');
    }
    this.size = data.length;

    // Save the fragment metadata, then the fragment data, if saving metadata fails, return the fail state
    await this.save();
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.startsWith('text');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return typeConversionMap.get(this.mimeType);
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if (typeConversionMap.get(contentType.parse(value).type)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if this fragment can be converted into the given extension
   * @param {string} value a file extension (e.g., '.txt', '.html', '.md')
   * @returns {boolean} true if this fragment can be converted to the given file extension
   */
  isSupportedExtension(value) {
    try {
      for (const t of typeExtensionMap.get(contentType.parse(this.type).type)) {
        if (value === t) {
          return true;
        }
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
