export const LIBELLES_STATUT = {
  nouveau: "Nouveau",
  passant: "Passant",
  redoublant: "Redoublant",
};

export function badgeStatut(statut) {
  const styles = {
    nouveau: "bg-ink/5 text-ink",
    passant: "bg-forest/10 text-forest",
    redoublant: "bg-brick/10 text-brick",
  };
  return styles[statut] || styles.nouveau;
}
