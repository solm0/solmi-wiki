import { Post } from "./type";

export default function GenerateChron(notes: Post[]) {
  // console.log('generate-chron called');

  const sortedNotes = notes.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  let y: string | null = null;
  let m: string | null = null;
  let d: string | null = null;

  sortedNotes.forEach((note) => {
    const publishedAt = new Date(note.publishedAt).toLocaleDateString('ko-KR');
    const year = publishedAt.toString().slice(0,4);
    const month = publishedAt.toString().slice(5,7);
    const day = publishedAt.toString().slice(9,11);

    if (!note.chron) {
      note.chron = {};
    }

    if (year !== y) {
      y = year;
      m = null;
      d = null;
      note.chron.year = year;
    }

    if (month !== m) {
      m = month;
      d = null;
      note.chron.month = month;
    }

    if (day !== d) {
      d = day;
      note.chron.day = day;
    }
  })

  return sortedNotes;
}