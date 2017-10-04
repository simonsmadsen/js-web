import { unpackArr } from './../../src/routing'


test('unpackArr', async () => {
  const packed = [
    { a: 1 },
    { b: 1 },
    [
      { a: 2 },
      { b: 2 },
      { c: 2 },
      [
        { d: 3 },
        { e: 4 }
      ]
    ],
    [
      { j: 4 }
    ]
  ]

  const unpacked = unpackArr(packed)
  expect(unpacked.length).toBe(8)
  expect(unpacked[2].a).toBe(2)
  expect(unpacked[5].d).toBe(3)
})
