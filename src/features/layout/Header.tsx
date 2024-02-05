import { Minus, XIcon } from 'lucide-react';

function DragRegion() {
  return <div id="drag" className="absolute left-0 top-0 bottom-0 right-28" />;
}

function HeaderButtons() {
  const handleMinimize = () => {
    window.electron.ipcRenderer.sendMessage('minimize');
  };

  const handleClose = () => {
    window.electron.ipcRenderer.sendMessage('close');
  };

  return (
    <div className="absolute flex right-0 top-0 bottom-0 h-14 w-fit">
      <button
        className="w-14 h-14 flex items-center justify-center transition-all duration-150 group bg-black/0 hover:bg-black/50"
        type="button"
        aria-label="Minimize"
        onClick={handleMinimize}
      >
        <Minus className="opacity-50 group-hover:opacity-75 transition-all duration-150 " />
      </button>
      <button
        className="w-14 h-14 flex items-center justify-center transition-all duration-150 group bg-black/0 hover:bg-red-500/25"
        type="button"
        aria-label="Close"
        onClick={handleClose}
      >
        <XIcon className="opacity-50 group-hover:opacity-75 transition-all duration-150 " />
      </button>
    </div>
  );
}

export default function Header() {
  return (
    <header className="w-full h-14 pl-5 flex items-center justify-between relative border-b border-b-gray-800 bg-black/50">
      <h1 className="text-lg font-medium select-none">Launcher</h1>
      <HeaderButtons />
      <DragRegion />
    </header>
  );
}
