export type Lesson = {
	id: number;
	name: string;
	// we don't need a completed we can just check if its 1
	progress: number; // 0 -> 1 (perc)

}