const VALID_ALGOS = [
    "cca-1D",
    "cca-2D",
    "cca-3D",
    "conway",
    "immigration",
    "quadlife",
    "langton",
    "entropy",
    "rule30",
    "rule90",
    "rule110",
] as const

export function getInitialAlgo(): string {
    const path = window.location.pathname.slice(1)
    return VALID_ALGOS.includes(path as typeof VALID_ALGOS[number]) ? path : "cca-2D"
}
