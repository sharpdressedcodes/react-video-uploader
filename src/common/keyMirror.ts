const keyMirror = <T = Record<any, any>>(obj: T) => Object
    .fromEntries(
        Object
            .entries(obj as Record<any, any>)
            .map(([key, value]) => ([key, value ?? key])),
    )
;

export default keyMirror;
