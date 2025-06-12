import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/novoChamado.css";

import {
  PlusCircle,
  Loader2,
  FileText,
  MessageSquare,
  Layers,
} from "lucide-react";

import LoadingSpinner from "../components/LoadingSpinner";


export default function NovoChamado() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoria: "",
  });
  const [categorias, setCategorias] = useState([]);

  const [loadingCategorias, setLoadingCategorias] = useState(true); 
  const [submitting, setSubmitting] = useState(false);



  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/categorias", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategorias(res.data);
      } catch {
        toast.error('Erro ao carregar categorias.');
      } finally {
        setLoadingCategorias(false);
      }
    })();
  }, []);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/tickets", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Chamado criado com sucesso!");
      setFormData({ title: "", description: "", categoria: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar chamado.", "erro")
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategorias) return <LoadingSpinner />;

  return (
    <div className="container-novo-chamado">
      <h2 className="title">
        <PlusCircle
          size={28}
          style={{ marginRight: 8, verticalAlign: "middle" }}
        />
        Novo Chamado
      </h2>

      <form onSubmit={handleSubmit} className="form-chamado">
        {}
        <div className="form-group">
          <label htmlFor="title">
            <FileText
              size={18}
              style={{ marginRight: 6, verticalAlign: "middle" }}
            />
            Título:
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Digite o título do chamado"
          />
        </div>

        {}
        <div className="form-group">
          <label htmlFor="description">
            <MessageSquare
              size={18}
              style={{ marginRight: 6, verticalAlign: "middle" }}
            />
            Descrição:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descreva o problema ou solicitação"
          />
        </div>

        {}
        <div className="form-group">
          <label htmlFor="categoria">
            <Layers
              size={18}
              style={{ marginRight: 6, verticalAlign: "middle" }}
            />
            Categoria:
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat.nome}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {}
        <button
          type="submit"
          className="btn-primary submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spin" style={{ marginRight: 6 }} />{" "}
              Criando...
            </>
          ) : (
            <>
              <PlusCircle size={18} style={{ marginRight: 6 }} /> Criar Chamado
            </>
          )}
        </button>
      </form>

      {}
      
    </div>
  );
}
