// type ModifiedVisualViewportType = Partial<VisualViewport> & {
//     height: number,
//     width: number,
// }

const isInViewport = (element: HTMLElement): boolean => {
    if (!element) {
        return false;
    }

    const rect: DOMRect = element.getBoundingClientRect();
    const { left: elementLeft, top: elementTop } = rect;
    const elementBottom = elementTop + rect.height;
    const elementRight = elementLeft + rect.width;
    const { pageLeft, pageTop, height: pageBottom, width: pageRight }: any = visualViewport;

    const isInVerticalViewport = (elementTop >= pageTop && elementTop <= pageBottom)
        || (elementBottom <= pageBottom && elementBottom >= pageTop);
    const isInHorizontalViewport = (elementLeft >= pageLeft && elementLeft <= pageRight)
        || (elementRight <= pageRight && elementRight >= pageLeft);

    return isInVerticalViewport && isInHorizontalViewport;
};

export default isInViewport;
