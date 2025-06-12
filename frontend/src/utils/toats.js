import { toast } from 'react-toastify';

export const mostrarSucesso = (mensagem) => toast.success(mensagem);
export const mostrarErro = (mensagem) => toast.error(mensagem);
export const mostrarInfo = (mensagem) => toast.info(mensagem);
export const mostrarAviso = (mensagem) => toast.warning(mensagem);
