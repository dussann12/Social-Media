import * as bcrypt from 'bcrypt';

export async function hashedPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    const IsMatch = await bcrypt.compare(password, hash);
    return IsMatch;
    
}