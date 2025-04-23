import type {ReadonlyHeaders} from '@/types/headers'

export const appCrudTableHeadersConst = {
  users: [
    {title: 'Photo', align: 'start', sortable: false, key: 'image'},
    {title: 'Nom', align: 'start', sortable: true, key: 'nom'},
    {title: 'Annee', align: 'start', sortable: true, key: 'annee'},
    {title: 'victoire', align: 'start', sortable: true, key: 'victoire'},
    {title: 'lieu', align: 'start', sortable: true, key: 'lieu'},
    {title: 'force', align: 'start', sortable: true, key: 'force'},
    {title: 'pertes', align: 'start', sortable: true, key: 'pertes'},
    {title: 'situation', align: 'start', sortable: true, key: 'situation'},
    {title: 'Actions', key: 'actions', sortable: false},
  ] satisfies ReadonlyHeaders,
}
