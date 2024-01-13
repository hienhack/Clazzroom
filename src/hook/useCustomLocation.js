import { useMemo } from "react";

function useCustomLocation() {
    const location = useMemo(() => {
        const pathname = window.location.pathname;
        const origin = window.location.origin;
        const href = window.location.href;
        const relativeHref = href.substring(origin.length);

        return { pathname, origin, href, relativeHref };
    }, [window.location.href])

    return location;
}

export default useCustomLocation;