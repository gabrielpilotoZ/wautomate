// Translate presentation only; keep API values and database enums unchanged.
const labels: Record<string, string> = {
    CONNECTED: "Conectado", DISCONNECTED: "Desconectado", CONNECTING: "Conectando",
    STOPPED: "Parado", SCAN_QR: "Aguardando QR Code", STARTING: "Iniciando",
    PENDING: "Pendente", SENT: "Enviado", DELIVERED: "Entregue", READ: "Lido",
    FAILED: "Falhou", SUCCESS: "Sucesso", ERROR: "Erro", PROCESSING: "Processando",
    COMPLETED: "Concluído", SUPERADMIN: "Superadministrador", OWNER: "Proprietário",
    STAFF: "Colaborador", EXACT: "Correspondência exata", CONTAINS: "Contém",
    STARTS_WITH: "Começa com", REGEX: "Expressão regular", ALL: "Todos",
    PRIVATE: "Conversas privadas", GROUP: "Grupos", TEXT: "Texto", IMAGE: "Imagem",
    VIDEO: "Vídeo", AUDIO: "Áudio", DOCUMENT: "Documento", STICKER: "Figurinha",
};

export function displayLabel(value: string): string {
    return labels[value.toUpperCase()] ?? value;
}
