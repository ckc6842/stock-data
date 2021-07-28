import { connect, connection } from "mongoose";

export async function getConnection (host: string = 'localhost', port: number = 27017) {
  await connect(`mongodb://${host}:${port}/stock`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  return connection
}
