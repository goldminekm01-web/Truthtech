// Minimal stub so the build passes. Voting/MPesa wiring was removed from lib/.
export async function saveVotePayment(_payment?: any): Promise<any> {
    return null;
}
export async function getVotePayment(_id?: string): Promise<any> {
    return null;
}
export async function updateVotePaymentStatus(_id?: string, _status?: string, _receipt?: string): Promise<any> {
    return null;
}
export function getCandidateByCode(_code?: string): any {
    return null;
}
export function getCandidateById(_id?: string): any {
    return null;
}
export async function getExistingCodes(): Promise<any[]> {
    return [];
}
export async function recordVotesFromPayment(_payment?: any): Promise<any> {
    return null;
}
