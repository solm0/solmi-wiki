import { Metadata } from "next";

export const metadata: Metadata = {
  title: "지도",
  description: "지도",
};

export default function MapPage() {
  return (
    <section className="relative flex flex-col items-start gap-8 w-full text-text-800 pt-[40vh] pb-8 overflow-y-scroll focus:outline-hidden">
      <p className="font-bold text-4xl">Comming Soon</p>
      <p>세계지도</p>
    </section>
  )
}