import { Presentation } from "@/components/presentation";
import { readIndice } from "@/lib/presentaciones-store";

export default async function Home() {
  const indice = await readIndice();
  const person = indice.people.find((item) => item.id === indice.activeId) ?? indice.people[0];
  if (!person) throw new Error("No hay presentaciones.");
  return (
    <Presentation
      initialPersonId={person.id}
      initialPeople={indice.people.map((item) => ({ id: item.id, name: item.name }))}
      initialSlides={person.slides}
      initialHero={person.hero}
    />
  );
}
