# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Ticket 1 - Display custom Agent ID on the Facilities report

#### Description

To support Facilities in using a custom ID for each agent in the report, we need to add a new field to the Agents table. This ID should be unique per Facilities.

#### Implementation details:

- Add a new migration that will:
  1. Add a new `TEXT` column named `custom_id` to the Agents table. This column can be `NULL`
  2. Add a `UNIQUE` constraint for the `custom_id` and `facility_id` combination on the Agents table
- Change the `getShiftsByFacility` function to return the value of this field along with the agent's information
- Change the `generateReport` function to include the ID returned by the `getShiftsByFacility` function

#### Acceptance criteria:

- A new column named `custom_id` was added to the Agents table
- A new constraint `UNIQUE` constraint was created
- The report correctly displays a `Custom ID` column
- The report displays the `custom_id` on each row or `N/A` in case no custom ID was set

Time/effort estimate: 2 hours

### Ticket 2 - Allow Facilities to create an Agent with a custom ID

#### Description

This ticket is a follow-up to `Ticket 1` and aims to enable Facilities to create agents with a custom ID. The custom ID field should accept only alphanumeric characters.

The reason for restricting the ID to alphanumeric characters is to ensure compatibility with the format used for displaying this data in reports, which could be affected by special characters or symbols.

#### Implementation details:

- Add the `customID` to the `POST /agents` schema
- Validate that the `customID` received by the create agent endpoint contains only alphanumeric characters
- Add the new field to the Agents `INSERT` statement
- Validate that the new `customID` received doesn't already exist for this Facilities
  - In case it does, return a response with a `400` status code and a meaningful message

#### Acceptance criteria:

- The endpoint does not allow creating agents with a non-alphanumeric custom ID
- The endpoint allows creating agents with a null custom ID
- The Facilities report should be returning the ID set by this endpoint correctly

Time/effort estimate: 2 hours

### Ticket 3 - Allow Facilities to add a custom ID to existing agents

#### Description

This ticket is a follow-up to `Ticket 1` and aims to enable Facilities to add a custom ID to an existing agent. The custom ID field should accept only alphanumeric characters.

The reason for restricting the ID to alphanumeric characters is to ensure compatibility with the format used for displaying this data in reports, which could be affected by special characters or symbols.

#### Implementation details:

- Add the `customID` to the `PUT /agents` schema
- Validate that the `customID` received by the create agent endpoint contains only alphanumeric characters
- Add the new field to the Agents `UPDATE` statement
- Validate that the new `customID` received doesn't already exist for this Facilities
  - In case it does, return a response with a `400` status code and a meaningful message
  - Make sure to not include the agent being currently updated, as it obviously can keep the same custom ID it already has

#### Acceptance criteria:

- The endpoint does not allow updating agents to non-alphanumeric custom IDs
- The endpoint allows updating agents to a null custom ID
- The Facilities report should be returning the ID set by this endpoint correctly

Time/effort estimate: 2 hours

### Observations

1. I have made the assumption that the company utilizes a Postgres database.
2. I have made the assumption that there is an API that is consumed by whatever interface is provided to facilities to create or update agents.
3. I have made the assumption that this API utilizes some library to perform initial validation and sanitize incoming data based on pre-defined schemas.
4. As the scope of the current ticket only pertains to the custom Agent ID field, I have excluded any changes required for systems that consume this hypothetical API, such as a Single Page Application (SPA) or a Lambda function that processes a CSV file in an S3 bucket. In the real-world, additional tickets or changes to the existing ones may be required to implement these changes, depending on the team structure and preferences. For instance, some teams may prefer to separate frontend changes into a different ticket, while others may prefer to include all changes within the same ticket.
5. My time/effort estimates assume a reasonable knowledge of the codebase and the systems in question.
6. I didn't include any specific details about testing, as I believe it's a fundamental aspect that should be implemented as a standard practice. However, I've come across teams that faced difficulties with this, so in such cases, it may be helpful to include it as part of the acceptance criteria.
