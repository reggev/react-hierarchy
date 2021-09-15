export type Data = {
  id: string
  rank: number
  parentId?: string | undefined
  name: string
}

const data: Data[] = [
  { rank: 1, id: '1', name: 'Eve' },
  { rank: 2, id: '2', parentId: '1', name: 'Cain' },
  { rank: 3, id: '3', parentId: '2', name: 'po' },
  { rank: 4, id: '4', parentId: '2', name: 'jim' },
  { rank: 1, id: '5', parentId: '2', name: 'kelly' },
  { rank: 0, id: '6', parentId: '1', name: 'Seth' },
  { rank: 1, id: '7', parentId: '6', name: 'Enos' },
  { rank: 5, id: '8', parentId: '6', name: 'Noam' },
  { rank: 2, id: '9', parentId: '6', name: 'joe' },
  { rank: 1, id: '10', parentId: '6', name: 'peggy' },
  { rank: 3, id: '11', parentId: '1', name: 'Abel' },
  { rank: 4, id: '12', parentId: '1', name: 'Awan' },
  { rank: 2, id: '13', parentId: '12', name: 'Enoch' },
  { rank: 1, id: '14', parentId: '1', name: 'Azura' }
]

export default data
