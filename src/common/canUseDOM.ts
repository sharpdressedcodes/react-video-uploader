const canUseDOM = Boolean(typeof window !== 'undefined' && window?.document?.createElement);

export default canUseDOM;
