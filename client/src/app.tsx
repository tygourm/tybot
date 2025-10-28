import react from "/react.svg";
import vite from "/vite.svg";

function App() {
  return (
    <div className="w-full h-screen flex flex-row gap-2 items-center justify-center">
      <img src={vite} className="size-icon" />
      <img src={react} className="size-icon" />
    </div>
  );
}

export { App };
