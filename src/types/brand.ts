// 📌 Définition stricte du type des données de création d'une marque
export interface CreateBrandData {
  name: string;
  email: string;
  mdp: string;
  mdp_confirm: string;
  avatar?: File | null;
}
