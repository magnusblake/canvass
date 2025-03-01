import sqlite3 from "sqlite3"
import { open } from "sqlite"

let db: any = null

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./mydb.sqlite",
      driver: sqlite3.Database,
    })
  }
  return db
}

export async function query(sql: string, params: any[] = []) {
  const db = await openDb()
  return db.all(sql, params)
}

export async function get(sql: string, params: any[] = []) {
  const db = await openDb()
  return db.get(sql, params)
}

export async function run(sql: string, params: any[] = []) {
  const db = await openDb()
  return db.run(sql, params)
}

const dbWrapper = {
  query,
  get,
  run,
}

export default dbWrapper

