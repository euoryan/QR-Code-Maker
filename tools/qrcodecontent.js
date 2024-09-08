// Adiciona o item ao menu de contexto
chrome.contextMenus.create({
    id: "generateQRCode",
    title: "Gerar QR Code",
    contexts: ["all"] // Adiciona o item a todos os contextos
});

// Adiciona o listener para o clique no item do menu de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "generateQRCode") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: generateQRCode,
            args: [tab.url, tab.title]
        });
    }
});

function generateQRCode(url, title) {
    // Cria o modal para exibir o QR code
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(200, 200, 200, 0.5)'; // Cinza médio com 80% de opacidade
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '99999999999999';
    modal.style.fontFamily = 'Space Grotesk, sans-serif';
    modal.style.opacity = '0'; // Inicialmente invisível para efeito de fade-in
    modal.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(modal);

    // Adiciona o CSS para os botões diretamente ao documento
    const style = document.createElement('style');
    style.textContent = `
        .svg-button, .png-button {
            background-color: #ffffff;
            border: 1px solid #dc3545;
            cursor: pointer;
            margin: 5px;
            padding: 10px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s, box-shadow 0.3s;
            width: 100%; /* Ocupa a largura total do modal */
        }

        .svg-button:hover, .png-button:hover {
            background-color: #f8f9fa;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .share-icon {
    width: 10px;
    height: 10px;
    filter: invert(0%); /* Ícone vermelho para contraste */
}

.link-container {
    display: flex;
    align-items: center; /* Alinha verticalmente o campo de entrada e o botão */
    width: 200px; /* Define a largura para combinar com a largura do QR code */
    max-width: 200px; /* Garante que não ultrapasse a largura do QR code */
    margin-top: 0px;
    margin-left: auto;
    margin-right: auto;
    position: relative; /* Para posicionar a bolha de notificação */
}

.link-input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #dcdcdc; /* Borda cinza clara por padrão */
    border-radius: 8px;
    font-size: 14px;
    background-color: transparent; /* Corrigido de #transparent para transparent */
    color: #000000; /* Cor do texto */
    margin-right: 10px; /* Espaço à direita do campo de entrada */
    margin-top: 0px; /* Distância da borda superior do item acima */
    margin-bottom: 0px; /* Distância da borda inferior do item abaixo */
    width: calc(100% - 20px); /* Ajusta a largura para não ultrapassar o contêiner pai */
    height: 30px; /* Ajuste a altura conforme necessário */
    box-sizing: border-box;
    transition: border-color 0.3s; /* Transição suave para a cor da borda */
}

.link-input:hover {
    border-color: #dc3545; /* Cor da borda em hover */
}

.share-button {
    padding: 10px; /* Ajuste o padding conforme necessário */
    border: none;
    border-radius: 8px;
    background-color: transparent;
    color: #dc3545;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px; /* Ajuste o tamanho da fonte conforme necessário */
    transition: color 0.3s, transform 0.3s;
    height: 40px; /* Ajusta a altura do botão para alinhar com o campo de entrada */
    margin-top: 0px; /* Distância da borda superior do item acima */
    margin-bottom: 0px; /* Distância da borda inferior do item abaixo */
}

.share-button:hover {
    color: #c82333;
}

        .notification {
            position: absolute;
            bottom: calc(100% + 5px); /* Diminui o espaço entre a caixa de texto e a bolha de notificação */
            left: 50%;
            transform: translateX(-50%);
            padding: 6px 8px;
            background-color: #000000D9;
            color: #fff;
            font-family: Space Grotesk, sans-serif;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none; /* Para evitar que o cursor interaja com a bolha */
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 200px; /* Define um tamanho máximo para a bolha de notificação */
            text-align: center;
            z-index: 10001; /* Para garantir que fique acima de outros elementos */
        }

        .notification::before {
            content: '';
            position: absolute;
            bottom: -15px; /* Ajusta a posição da seta para a bolha */
            left: 50%;
            transform: translateX(-50%);
            border-width: 8px; /* Ajusta o tamanho da seta */
            border-style: solid;
            border-color: #000000D9 transparent transparent transparent; /* Seta apontando para a caixa de texto */
        }

        .notification.show {
            opacity: 1;
        }

    `;
    document.head.appendChild(style);

    // Cria o conteúdo do modal
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#ffffff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
    modalContent.style.width = 'relative';
    modalContent.style.height = 'relative'; // Define a altura do modal
    modalContent.style.maxWidth = '100%'; // Para garantir que o modal não fique muito largo em telas pequenas
    modalContent.style.textAlign = 'center';
    modalContent.style.position = 'relative';
    modalContent.style.opacity = '1'; // Inicialmente visível
    modalContent.style.transition = 'opacity 0.3s ease';
    modal.appendChild(modalContent);

    // Cria o contêiner para o título e o QR code
    const contentContainer = document.createElement('div');
    contentContainer.style.maxWidth = '200px'; // Define a largura máxima igual à do QR code
    contentContainer.style.margin = '0 auto'; // Centraliza o contêiner dentro do modal
    modalContent.appendChild(contentContainer);

    // Cria o elemento do QR code com efeito de luz inicial
    const qrCodeElement = document.createElement('div');
    qrCodeElement.id = 'qrCode';
    qrCodeElement.style.marginTop = '0px'; // Espaço acima do QR code
    qrCodeElement.style.marginBottom = '0px'; // Espaço abaixo do QR code
    qrCodeElement.style.display = 'flex';
    qrCodeElement.style.justifyContent = 'center';
    qrCodeElement.style.alignItems = 'center';
    qrCodeElement.style.cursor = 'pointer';
    qrCodeElement.style.width = '200px';
    qrCodeElement.style.height = '200px';
    qrCodeElement.style.position = 'relative';
    qrCodeElement.style.overflow = 'hidden';

    // Adiciona o estilo de animação diretamente ao elemento
    const keyframes = `
@keyframes lightEffect {
    0% {
        background-position: 100% 0;
    }
    50% {
        background-position: 0 100%;
    }
    100% {
        background-position: 100% 0;
    }
}
`;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    // Adiciona o efeito de luz
    const lightEffectElement = document.createElement('div');
    lightEffectElement.style.position = 'absolute';
    lightEffectElement.style.top = '0';
    lightEffectElement.style.left = '0';
    lightEffectElement.style.width = '100%';
    lightEffectElement.style.height = '100%';
    lightEffectElement.style.background = 'linear-gradient(45deg, #fff, #eeeeee, #fff, #eeeeee)';
    lightEffectElement.style.backgroundSize = '400% 400%'; // Tamanho maior para efeito de movimento contínuo
    lightEffectElement.style.animation = 'lightEffect 1s linear infinite'; // Animação mais lenta e fluida
    qrCodeElement.appendChild(lightEffectElement);

    contentContainer.appendChild(qrCodeElement);

    // Substitui o efeito de luz pelo QR code após 1.5 segundos
    setTimeout(() => {
        // Remove o efeito de luz
        qrCodeElement.removeChild(lightEffectElement);

        // Gera o QR code com personalização
        const qrCode = new QRCode(qrCodeElement, {
            text: url,
            width: 200,
            height: 200,
            colorDark: "#202020",  // Cor do código
            colorLight: "#ffffff", // Cor de fundo
            correctLevel: QRCode.CorrectLevel.H // Nível de correção de erro
        });

        // Função para limitar o número de caracteres
        function limitText(text, maxLength) {
            if (text.length > maxLength) {
                return text.slice(0, maxLength) + '...'; // Adiciona elipse se exceder o limite
            }
            return text;
        }

        // Número máximo de caracteres
        const maxLength = 26; // Altere conforme necessário

        // Cria o título com o nome da página
        const titleElement = document.createElement('h3');
        titleElement.textContent = limitText(title, maxLength);
        titleElement.style.marginTop = '25px'; // Espaço acima do título
        titleElement.style.marginBottom = '8px'; // Espaço abaixo do título
        titleElement.style.fontSize = '15px';
        titleElement.style.color = '#333333'; // Cor escura para contraste
        titleElement.style.fontWeight = 'normal'; // Remover negrito
        titleElement.style.fontFamily = 'Space Grotesk, sans-serif'; // Fonte Space Grotesk
        titleElement.style.textAlign = 'left'; // Alinhar à esquerda
        titleElement.style.width = '200px'; // Define a largura do título igual à do QR code
        titleElement.style.overflow = 'hidden'; // Oculta o excesso de texto
        titleElement.style.textOverflow = 'ellipsis'; // Adiciona elipse para texto que excede o contêiner
        titleElement.style.whiteSpace = 'nowrap'; // Impede a quebra de linha
        contentContainer.appendChild(titleElement);

        // Adiciona o event listener para redirecionar ao clicar no QR code
        qrCodeElement.addEventListener('click', () => {
            // Fecha o modal (supondo que o modal tenha um id 'qrCodeModal')
            const modal = document.getElementById('qrCodeModal');
            if (modal) {
                modal.style.display = 'none'; // Ou qualquer outra maneira de fechar o modal
            }
            // Redireciona para a página do QR code na mesma aba
            window.location.href = url;
        });
    }, 1800); // 1500 milissegundos = 1.5 segundos

    // Cria a caixa de texto com o link e o botão de compartilhar
    const linkContainer = document.createElement('div');
    linkContainer.className = 'link-container';

    const linkInput = document.createElement('input');
    linkInput.className = 'link-input';
    linkInput.type = 'text';
    linkInput.value = url;
    linkInput.readOnly = true;

    const shareButton = document.createElement('button');
    shareButton.className = 'share-button';
    shareButton.innerHTML = '<img src="https://icons.getbootstrap.com/assets/icons/share.svg" alt="Compartilhar" class="share-icon">';

    shareButton.addEventListener('click', () => {
        showDownloadOptions();
    });

    linkContainer.appendChild(linkInput);
    linkContainer.appendChild(shareButton);
    modalContent.appendChild(linkContainer);

    // Cria a bolha de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Copiado';
    linkContainer.appendChild(notification);

    // Função para copiar o link para a área de transferência
    linkInput.addEventListener('click', () => {
        linkInput.select();
        document.execCommand('copy');
        notification.classList.add('show');

        // Remove a bolha de notificação após alguns segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 1500);
    });

    function downloadQRCode(format) {
        try {
            if (format === 'svg') {
                const svgElement = document.querySelector('#qrCode svg');
                if (svgElement) {
                    // Serializa o SVG para string
                    const svgData = new XMLSerializer().serializeToString(svgElement);

                    // Adiciona a declaração XML para garantir a compatibilidade
                    const svgDataWithDeclaration = `<?xml version="1.0" encoding="UTF-8"?>${svgData}`;

                    // Codifica o SVG para URL
                    const encodedSvgData = encodeURIComponent(svgDataWithDeclaration);
                    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodedSvgData}`;

                    // Cria e clica no link para iniciar o download
                    const a = document.createElement('a');
                    a.href = svgUrl;
                    a.download = `QRCode.${format}`;
                    document.body.appendChild(a); // Adiciona ao DOM para garantir que funcione em todos os navegadores
                    a.click();

                    // Limpeza
                    document.body.removeChild(a);
                } else {
                    console.error('SVG element not found.');
                    alert("Esta opção de download ainda está em desenvolvimento. Por favor, tente baixar o PNG por enquanto! ;)");
                }
            } else if (format === 'png') {
                const canvas = document.querySelector('#qrCode canvas');
                if (canvas) {
                    // Gera o QR code como PNG a partir do canvas
                    const image = canvas.toDataURL('image/png');

                    // Cria e clica no link para iniciar o download
                    const a = document.createElement('a');
                    a.href = image;
                    a.download = `QRCode.${format}`;
                    document.body.appendChild(a); // Adiciona ao DOM para garantir que funcione em todos os navegadores
                    a.click();

                    // Limpeza
                    document.body.removeChild(a);
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert("Essa modalidade de download está em criação, quando estiver disponível o admin irá liberar para você!");
        }
    }


    // Função para mostrar as opções de download
    function showDownloadOptions() {
        // Criação do modal de opções
        const optionsModal = document.createElement('div');
        optionsModal.style.position = 'fixed';
        optionsModal.style.top = '0';
        optionsModal.style.left = '0';
        optionsModal.style.width = '100%';
        optionsModal.style.height = '100%';
        optionsModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        optionsModal.style.display = 'flex';
        optionsModal.style.alignItems = 'center';
        optionsModal.style.justifyContent = 'center';
        optionsModal.style.zIndex = '999999999999999';
        optionsModal.style.opacity = '0'; // Inicialmente invisível
        optionsModal.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(optionsModal);

        // Criação do conteúdo do modal
        const optionsContent = document.createElement('div');
        optionsContent.style.backgroundColor = '#eeeeee';
        optionsContent.style.padding = '20px';
        optionsContent.style.borderRadius = '8px';
        optionsContent.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        optionsContent.style.textAlign = 'center';
        optionsContent.style.position = 'relative';
        optionsContent.style.width = '250px'; // Largura reduzida para um design mais compacto
        optionsContent.style.opacity = '1'; // Inicialmente visível
        optionsContent.style.transition = 'opacity 0.3s ease';
        optionsModal.appendChild(optionsContent);

        // Título do modal
        const optionsTitle = document.createElement('h3');
        optionsTitle.textContent = 'Formato?';
        optionsTitle.style.marginBottom = '20px';
        optionsTitle.style.marginTop = '0px';
        optionsTitle.style.fontSize = '18px';
        optionsTitle.style.color = '#202020'; // Cor escura para contraste
        optionsTitle.style.fontWeight = '600';
        optionsTitle.style.fontFamily = 'Space Grotesk, sans-serif'; // Fonte Space Grotesk
        optionsContent.appendChild(optionsTitle);

        // Container dos botões
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '15px'; // Espaço aumentado entre os botões
        buttonContainer.style.marginTop = '20px'; // Espaçamento entre o título e os botões
        optionsContent.appendChild(buttonContainer);

        // Botão SVG
        const svgButton = document.createElement('button');
        svgButton.className = 'svg-button';
        svgButton.style.backgroundColor = 'transparent'; // Fundo transparente para um design minimalista
        svgButton.style.border = '2px solid transparent'; // Inicialmente sem borda
        svgButton.style.borderRadius = '4px';
        svgButton.style.padding = '8px';
        svgButton.style.cursor = 'pointer';
        svgButton.style.transition = 'border-color 0.3s ease'; // Transição suave da borda
        svgButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        svgButton.style.position = 'relative'; // Para o texto de fallback
        svgButton.innerHTML = `
            <img src="https://icons.getbootstrap.com/assets/icons/filetype-svg.svg" alt="SVG" style="width: 24px; height: 24px;">
            <span style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 8px; color: #dc3545; font-family: Space Grotesk, sans-serif;">SVG</span>
        `;
        svgButton.addEventListener('mouseover', () => {
            svgButton.style.borderColor = '#dc3545'; // Adiciona a borda vermelha no hover
        });
        svgButton.addEventListener('mouseout', () => {
            svgButton.style.borderColor = 'transparent'; // Remove a borda no hover
        });
        svgButton.addEventListener('click', () => downloadQRCode('svg'));
        buttonContainer.appendChild(svgButton);

        // Botão PNG
        const pngButton = document.createElement('button');
        pngButton.className = 'png-button';
        pngButton.style.backgroundColor = 'transparent'; // Fundo transparente para um design minimalista
        pngButton.style.border = '2px solid transparent'; // Inicialmente sem borda
        pngButton.style.borderRadius = '4px';
        pngButton.style.padding = '8px';
        pngButton.style.cursor = 'pointer';
        pngButton.style.transition = 'border-color 0.3s ease'; // Transição suave da borda
        pngButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        pngButton.style.position = 'relative'; // Para o texto de fallback
        pngButton.innerHTML = `
            <img src="https://icons.getbootstrap.com/assets/icons/filetype-png.svg" alt="PNG" style="width: 24px; height: 24px;">
            <span style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 8px; color: #dc3545; font-family: Space Grotesk, sans-serif;">PNG</span>
        `;
        pngButton.addEventListener('mouseover', () => {
            pngButton.style.borderColor = '#dc3545'; // Adiciona a borda vermelha no hover
        });
        pngButton.addEventListener('mouseout', () => {
            pngButton.style.borderColor = 'transparent'; // Remove a borda no hover
        });
        pngButton.addEventListener('click', () => downloadQRCode('png'));
        buttonContainer.appendChild(pngButton);

        // Exibe o modal com efeito de fade-in
        setTimeout(() => {
            optionsModal.style.opacity = '1';
        }, 10); // Pequeno atraso para o efeito de fade-in

        // Adiciona o evento de clique fora do modal para fechá-lo
        optionsModal.addEventListener('click', (event) => {
            if (event.target === optionsModal) {
                document.body.removeChild(optionsModal);
            }
        });
    }


    // Exibe o modal com efeito de fade-in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10); // Pequeno atraso para o efeito de fade-in

    // Adiciona o evento de clique fora do modal para fechá-lo
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });

    return modal;
}
