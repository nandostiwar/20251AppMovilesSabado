function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Marketplace</h1>
        <div className="flex items-center gap-4">
          <span>Hola, {user.name}</span>
          <button 
            onClick={onLogout}
            className="bg-white text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 