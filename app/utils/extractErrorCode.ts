export default function extractFetchStatusCode(err: unknown): number {
    if (err instanceof Response) {
        return err.status;
    }

    if (typeof err === "object" && err !== null) {
        const maybeResponse = err as { status?: number };
        if (typeof maybeResponse.status === "number") {
            return maybeResponse.status;
        }
    }

    return 500;
}
