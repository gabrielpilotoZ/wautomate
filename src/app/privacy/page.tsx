import Link from "next/link";
import { ArrowLeft, Lock, Shield } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | WA-AKG",
    description: "Privacy Policy for WA-AKG self-hosted WhatsApp Gateway. Zero-tracking architecture, data ownership, and security practices.",
    openGraph: {
        title: "Privacy Policy | WA-AKG",
        description: "Privacy Policy for WA-AKG self-hosted WhatsApp Gateway.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | WA-AKG",
        description: "Privacy Policy for WA-AKG self-hosted WhatsApp Gateway.",
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden py-24 selection:bg-primary/30 selection:text-primary-foreground">
            {/* Ambient background glows */}
            <div className="fixed top-0 right-1/4 translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-1/4 -translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] bg-emerald-500/5 dark:bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="container max-w-4xl px-4 mx-auto relative z-10">

                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Voltar ao início
                </Link>

                <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Shield className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Política de privacidade</h1>
                            <p className="text-muted-foreground mt-2">Em vigor desde: {new Date().toLocaleDateString("pt-BR")}</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-p:leading-relaxed">

                        <p className="lead text-lg text-muted-foreground mb-8">
                            Seus dados pertencem a você. Esta política descreve como as informações são tratadas ao usar esta instalação do WA-AKG.
                        </p>

                        <h2 className="flex items-center gap-2 mt-8 text-2xl border-b pb-2">
                            <Lock className="h-6 w-6 text-blue-500" />
                            1. Armazenamento e comunicação externa
                        </h2>
                        <p>
                            O WA-AKG foi desenvolvido para ser <strong>hospedado pelo próprio usuário</strong>. Os dados principais são processados no equipamento em que o aplicativo está instalado.
                        </p>
                        <ul>
                            <li><strong>Monitoramento da instalação:</strong> Esta versão envia periodicamente ao servidor do projeto o nome e o endereço da instalação, a plataforma, a versão do Node e o uso de memória. Esse aviso não inclui o conteúdo das mensagens.</li>
                            <li><strong>Controle dos dados:</strong> Contatos, mensagens, agendamentos e respostas automáticas ficam no banco de dados da instalação, sob controle de quem administra o servidor.</li>
                        </ul>

                        <h2 className="mt-8 text-2xl border-b pb-2">2. Dados processados localmente</h2>
                        <p>
                            O aplicativo instalado no servidor utiliza:
                        </p>
                        <ul>
                            <li><strong>Credenciais de acesso:</strong> As senhas do painel são protegidas com hash bcrypt antes de serem armazenadas no banco local.</li>
                            <li><strong>Sessões do WhatsApp:</strong> O WA-AKG conecta-se ao WhatsApp Web. As chaves necessárias para manter a conexão são armazenadas no servidor da instalação.</li>
                            <li><strong>Registros de comunicação:</strong> As mensagens enviadas e recebidas são registradas no banco local para oferecer histórico e recursos de webhook.</li>
                        </ul>

                        <h2 className="mt-8 text-2xl border-b pb-2">3. Proteção das informações</h2>
                        <p>
                            A segurança dos dados depende também do ambiente de hospedagem. Recomenda-se:
                        </p>
                        <ul>
                            <li>Publicar o aplicativo por um proxy reverso com <strong>criptografia SSL/TLS</strong> (HTTPS).</li>
                            <li>Proteger o servidor com firewall e autenticação SSH por chave.</li>
                            <li>Manter o sistema operacional e o Node.js atualizados.</li>
                        </ul>

                        <h2 className="mt-8 text-2xl border-b pb-2">4. Integrações de terceiros</h2>
                        <p>
                            O WA-AKG utiliza a biblioteca <code>@whiskeysockets/baileys</code> para se comunicar com os servidores do WhatsApp. O servidor estabelece uma conexão direta com o WhatsApp. Seu uso continua sujeito à política de privacidade da Meta.
                        </p>

                        <div className="mt-12 p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                            <p className="font-semibold mb-2">Precisa de mais detalhes?</p>
                            <p className="text-sm text-muted-foreground mb-0">Para dúvidas sobre o tratamento dos dados ou para examinar o código, acesse o <Link href="https://github.com/mrifqidaffaaditya/WA-AKG">repositório no GitHub</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
