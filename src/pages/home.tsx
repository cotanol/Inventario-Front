import Header from "../components/header";

const HomePage = () => {
  return (
    <div>
      <Header titulo="Página de Inicio" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Bienvenido a la Página de Inicio
        </h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-700"></p>
          Esta es la página principal de la aplicación.
        </div>
      </div>
    </div>
  );
};

export default HomePage;
