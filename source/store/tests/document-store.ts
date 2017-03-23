import {DocumentStore} from '../document-store';

describe('DocumentStore', () => {
  const mockApplication = {renderUri: () => Promise.resolve({a: 1})} as any;

  it('can never contain more than the size provided in the constructor', async () => {
    const cache = new DocumentStore(mockApplication, 1);
    await cache.load('http://localhost/1');
    await cache.load('http://localhost/2');
    expect(cache.size).toBe(1);
  });

  it('can reorder the items based on last access', async () => {
    const cache = new DocumentStore(mockApplication, 3);
    await cache.load('http://localhost/1');
    await cache.load('http://localhost/2');
    await cache.load('http://localhost/3');
    expect(cache.size).toBe(3);

    await cache.load('http://localhost/1'); // move it to front
    await cache.load('http://localhost/4');
    expect(cache.size).toBe(3);

    mockApplication.renderUri = () => {throw new Error('Should not be called')};

    expect(await cache.load('http://localhost/1')).toEqual({a:1}); // must be cached instance
  });
});