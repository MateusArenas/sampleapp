export type User = {
  id: string | number
  type: string // admin | professor | aluno ...
  email: string
  nome: string
  phoneNumber: string
  avatarUrl?: string
}