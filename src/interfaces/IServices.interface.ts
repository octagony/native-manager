export type TSetState<T> = (
	partial: T | Partial<T> | ((state: T) => T | Partial<T>),
	replace?: boolean,
) => void;

export type TGetState<T> = () => T;
