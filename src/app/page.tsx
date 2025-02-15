import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="p-10">
        <h1 className="text-3xl font-bold">Welcome to Bandung Watch App!</h1>
        <p>Toggle the button to switch themes.</p>
      </main>
    </div>
  );
}
