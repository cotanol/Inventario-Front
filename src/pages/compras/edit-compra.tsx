import { useNavigate } from "react-router-dom";
import Header from "../../components/header";

const EditCompraPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header titulo="Editar Compra" />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-center text-gray-500">
            Función de edición de compra en desarrollo...
          </p>
          <button
            onClick={() => navigate("/compras")}
            className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg"
          >
            Volver a Compras
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCompraPage;
