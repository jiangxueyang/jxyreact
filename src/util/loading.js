export default {
    init () {
        this.close();
        let container = document.createElement('div'),
            winH = window.innerHeight;
        
        container.setAttribute('id', 'loading-container');
        container.style.height = winH +'px';
        container.innerHTML = '<svg viewBox="25 25 50 50" class="circular center"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>';
        
        document.body.appendChild(container);
        
    },
    close(){
        let container = document.querySelector('#loading-container');
        container && document.body.removeChild(container);
    }
}