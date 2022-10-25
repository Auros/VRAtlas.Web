export function clickOutside(node: HTMLElement) {
    const handleClick = (event: Event) => {
        const element = event.target as Element;
        if (node && !node.contains(element) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('click_outside'));
        }
    };

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
}
