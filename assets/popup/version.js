document.addEventListener('DOMContentLoaded', () => {
    // Obtém a versão do manifest
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;

    // Atualiza o conteúdo do elemento com o id 'version'
    document.getElementById('version').textContent = `v${version}`;
});
