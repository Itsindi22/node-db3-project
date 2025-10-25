const db = require('../../data/db-config')

function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .count('st.step_id as number_of_steps')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
    .select('sc.*')
}

async function findById(scheme_id) { // EXERCISE B
  /*
    (comments unchanged)
  */
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.scheme_id', 'sc.scheme_name', 'st.step_id', 'st.step_number', 'st.instructions')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number')

  // If no scheme exists, return null
  if (rows.length === 0) return null

  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: []
  }

  rows.forEach(row => {
    if (row.step_id) {
      result.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        instructions: row.instructions
      })
    }
  })

  return result
}

async function findSteps(scheme_id) { // EXERCISE C
  /*
    (comments unchanged)
  */
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number')

  // If no steps return empty array
  if (!rows[0] || !rows[0].step_id) {
    return []
  }

  return rows
}

// functions D & E left untouched as requested

function add(scheme) { // EXERCISE D
}

function addStep(scheme_id, step) { // EXERCISE E
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
