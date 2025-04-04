import ShortForm from "@/app/components/ShortForm";
import ShortGrid from "@/app/components/ShortGrid";

export default function Home() {
  return (
    <main className="mt-12">
      <div className="max-w-4xl w-7/8 mx-auto">
        <h1 className="text-4xl text-center">
          Acortador de <span className="font-bold">URL</span>
        </h1>
      <ShortForm />

      <ShortGrid />
      </div>
    </main>
  );
}
