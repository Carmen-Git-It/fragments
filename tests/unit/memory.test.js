// TODO: Write tests for ../../model/data/memory/index.js

const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data');

const { Fragment } = require('../../src/model/fragment');

const fragMetadata = {
  id: '1',
  ownerId: '1',
  created: Date.now(),
  updated: Date.now(),
  type: 'text/plain',
  size: 256,
};

const fragData = {
  value: 123,
};

describe('memory', () => {
  test('writeFragment returns nothing', () => {
    const fragment = new Fragment(fragMetadata);
    const result = writeFragment(fragment);
    return result.then((data) => {
      expect(data).toBe(undefined);
    });
  });

  test('readFragment returns the fragment we wrote', () => {
    const result = readFragment('1', '1');
    return result.then((data) => {
      expect(data).toEqual(fragMetadata);
    });
  });

  test('readFragment with invalid id returns nothing', () => {
    const result = readFragment('1', '2');
    return result.then((data) => {
      expect(data).toBe(undefined);
    });
  });

  test('writeFragmentData returns nothing', () => {
    const result = writeFragmentData(fragMetadata.ownerId, fragMetadata.id, fragData);
    return result.then((data) => {
      expect(data).toBe(undefined);
    });
  });

  test('readFragmentData returns the data we wrote', () => {
    const result = readFragmentData(fragMetadata.ownerId, fragMetadata.id);
    return result.then((data) => {
      expect(data).toEqual(fragData);
    });
  });

  test('readFragmentData with invalid id returns nothing', () => {
    const result = readFragmentData('1', '2');
    return result.then((data) => {
      expect(data).toBe(undefined);
    });
  });

  test('listFragments returns an empty array for an owner with no fragments', () => {
    const result = listFragments('2');
    return result.then((data) => {
      expect(data).toEqual([]);
    });
  });

  test('listFragments returns an array of fragment IDs', () => {
    const result = listFragments('1');
    return result.then((data) => {
      expect(data).toEqual([fragMetadata.id]);
    });
  });

  test('listFragments expanded returns an empty array for an owner with no fragments', () => {
    const result = listFragments('2', true);
    return result.then((data) => {
      expect(data).toEqual([]);
    });
  });

  test('listFragments expanded returns an expanded list of fragments', () => {
    const result = listFragments('1', true);
    return result.then((data) => {
      expect(data).toEqual([fragMetadata]);
    });
  });

  test('deleteFragment on valid id returns nothing', () => {
    const result = deleteFragment('1', '1');
    return result.then((data) => {
      expect(data).toStrictEqual([undefined, undefined]);
    });
  });

  test('deleteFragment removes fragment written', () => {
    return writeFragment(new Fragment(fragMetadata)).then(() => {
      writeFragmentData(fragMetadata.ownerId, fragMetadata.id, fragData).then(() => {
        deleteFragment(fragMetadata.ownerId, fragMetadata.id).then(() => {
          readFragment(fragMetadata.ownerId, fragMetadata.id).then((data) => {
            expect(data).toBe(undefined);
          });
        });
      });
    });
  });
});
