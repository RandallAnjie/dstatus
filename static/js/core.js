/**
 * 核心工具函数
 */

// 显示加载中
function startloading() {
    document.getElementById('loading').classList.remove('hidden');
}

// 隐藏加载中
function endloading() {
    document.getElementById('loading').classList.add('hidden');
}

// 页面预加载功能
function preloadNextPages() {
    // 获取当前页面的所有本站链接
    const links = Array.from(document.querySelectorAll('a[href^="/"]'))
        .filter(link => {
            const href = link.getAttribute('href');
            return href && !href.startsWith('#') && !href.includes('logout');
        })
        .slice(0, 3); // 最多预取3个页面
    
    // 添加预取提示
    links.forEach(link => {
        const href = link.getAttribute('href');
        const linkEl = document.createElement('link');
        linkEl.rel = 'prefetch';
        linkEl.href = href;
        document.head.appendChild(linkEl);
        console.log('预加载页面:', href);
    });
}

// 平滑页面转场
function setupSmoothPageTransitions() {
    // 点击链接时添加转场效果
    document.addEventListener('click', function(e) {
        // 检查是否点击了链接
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        // 检查是否是本站链接且不是锚点链接
        if (href && href.startsWith('/') && !href.startsWith('#') && !href.includes('logout')) {
            e.preventDefault();
            
            // 添加页面退出动画
            document.body.classList.add('page-transition-out');
            
            // 延迟执行跳转，让动画有时间完成
            setTimeout(() => {
                window.location.href = href;
            }, 150);
        }
    });
    
    // 页面加载时添加入场动画
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('page-transition-in');
        setTimeout(() => {
            document.body.classList.remove('page-transition-in');
        }, 300);
    });
}

// 添加转场效果的CSS
function addTransitionStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            transition: opacity 0.15s ease;
        }
        body.page-transition-out {
            opacity: 0.7;
        }
        body.page-transition-in {
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// 显示通知
function notice(msg, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-full`;
    
    // 根据类型设置样式
    switch(type) {
        case 'success':
            notification.className += ' bg-green-500 text-white';
            break;
        case 'error':
            notification.className += ' bg-red-500 text-white';
            break;
        case 'warning':
            notification.className += ' bg-yellow-500 text-white';
            break;
        default:
            notification.className += ' bg-blue-500 text-white';
    }
    
    // 设置内容
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="text-sm font-medium">${msg}</span>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 发送POST请求
async function postjson(url, data) {
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

// 获取元素值
function V(id) {
    return document.getElementById(id).value;
}

// 获取元素
function E(id) {
    return document.getElementById(id);
}

// 页面跳转
function copy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    notice("复制成功", "success");
}

function open(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
}

function sleep(ti){return new Promise((resolve)=>setTimeout(resolve,ti));}
function refreshPage(ti=600){sleep(ti).then(()=>{window.location.reload()});}
function redirect(url,ti=0){sleep(ti).then(()=>{window.location.href=url});}

function setQuery(key,val){
    var x=new URLSearchParams(window.location.search);
    x.set(key,val);
    window.location.search=x.toString();
}
function delQuery(key){
    var x=new URLSearchParams(window.location.search);
    x.delete(key);
    window.location.search=x.toString();
}
window.onload=()=>{
    document.querySelectorAll("[href]").forEach(x=>{
        if(x.tagName!='A'&&x.tagName!='LINK')
            x.onclick=()=>{open(x.getAttribute("href"));};
    });
    document.querySelectorAll(".ccp").forEach(x=>{
        x.onclick=(x)=>{copy(x.target.innerText);};
        x.setAttribute("mdui-tooltip","{content:'点击复制'}");
    });
    
    // 添加页面转场样式
    addTransitionStyles();
    
    // 设置页面转场
    setupSmoothPageTransitions();
    
    // 页面加载完成后延迟预加载其他页面
    setTimeout(preloadNextPages, 300);
};