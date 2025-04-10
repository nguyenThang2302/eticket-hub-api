variable "schema_name" {
  type        = string
  description = "MainDB Schema for eTicketHub"
  default     = "eth_main"
}

schema "main_schema" {
  name    = var.schema_name
  charset = "utf8mb4"
  collate = "utf8mb4_unicode_ci"
  comment = "Main schema for eTicketHub"
}

table "users" {
  schema  = schema.main_schema
  comment = "Table for storing user information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the user"
  }

  column "name" {
    type    = varchar(255)
    null    = false
    comment = "Full name of the user"
  }

  column "avatar_url" {
    type    = varchar(255)
    null    = false
    comment = "URL of the user's avatar"
  }

  column "email" {
    type    = varchar(255)
    null    = false
    comment = "Email address of the user"
  }

  column "password" {
    type    = varchar(255)
    null    = true
    comment = "Password of the user"
  }

  column "is_verified" {
    type    = boolean
    default = false
    null    = false
    comment = "Flag indicating if the user is verified"
  }

  column "role" {
    type    = varchar(16)
    default = "USER"
    null    = false
    comment = "Role of the user (USER, ADMIN, PROMOTER, VENUE)"
  }

  column "provider" {
    type    = varchar(10)
    default = "LOCAL"
    null    = false
    comment = "Provider of the user (SYSTEM, GOOGLE, FACEBOOK)"
  }

  column "sex" {
    type    = varchar(10)
    default = null
    null    = true
    comment = "Sex of the user (male, female)"
  }

  column "date_of_birth" {
    type    = date
    default = null
    null    = true
    comment = "Date of birth of the user"
  }

  column "phone_number" {
    type    = varchar(10)
    default = null
    null    = true
    comment = "Phone number of the user"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the user was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the user was last updated"
  }

  column "created_by" {
    type    = varchar(255)
    null    = true
    comment = "Identifier of the user who created this user"
  }

  column "updated_by" {
    type    = varchar(255)
    null    = true
    comment = "Identifier of the user who last updated this user"
  }

  primary_key {
    columns = [
      column.id
    ]
  }

  index "idx_users_email" {
    columns = [column.email]
    unique  = true
  }
}

table "access_tokens" {
  schema  = schema.main_schema
  comment = "Table for storing access tokens"

  column "id" {
    type    = varchar(16)
    comment = "Unique identifier for the access token"
  }

  column "expired_at" {
    type    = datetime
    comment = "Expiration date of the access token"
  }

  column "user_id" {
    type    = varchar(16)
    comment = "Foreign key referencing the user associated with the access token"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the access token was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the access token was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the record."
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the record."
  }

  primary_key {
    columns = [
      column.id
    ]
  }

  foreign_key "fk_access_tokens_users" {
    columns     = [column.user_id]
    ref_columns = [table.users.column.id]
    on_update   = "NO_ACTION"
    on_delete   = "CASCADE"
  }
}

table "refresh_tokens" {
  schema  = schema.main_schema
  comment = "Table for storing refresh tokens"

  column "id" {
    type    = varchar(16)
    comment = "Unique identifier for the refresh token"
  }

  column "expired_at" {
    type    = datetime
    comment = "Expiration date of the refresh token"
  }

  column "user_id" {
    type    = varchar(16)
    comment = "Foreign key referencing the user associated with the refresh token"
  }

  column "access_token_id" {
    type    = varchar(16)
    null    = true
    comment = "Foreign key referencing the access token associated with the refresh token"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the refresh token was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the refresh token was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the record."
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the record."
  }

  foreign_key "fk_refresh_tokens_users" {
    columns     = [column.user_id]
    ref_columns = [table.users.column.id]
    on_update   = "NO_ACTION"
    on_delete   = "CASCADE"
  }

  foreign_key "fk_refresh_tokens_access_tokens" {
    columns     = [column.access_token_id]
    ref_columns = [table.access_tokens.column.id]
    on_update   = "NO_ACTION"
    on_delete   = "SET_NULL"
  }

  index "idx_refresh_tokens_access_token_id" {
    columns = [column.access_token_id]
    unique  = true
  }
}

table "organizations" {
  schema  = schema.main_schema
  comment = "Table for storing organization information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the organization"
  }

  column "lang_code" {
    type    = varchar(5)
    null    = false
    comment = "Language code associated with the organization"
  }

  column "name" {
    type    = varchar(255)
    null    = false
    comment = "Name of the organization"
  }

  column "description" {
    type    = varchar(255)
    null    = true
    comment = "Description of the organization"
  }

  column "is_active" {
    type    = boolean
    null    = false
    default = true
    comment = "Flag indicating if the organization is active"
  }

  column "status" {
    type    = varchar(10)
    null    = true
    comment = "Status of the organization"
  }

  column "logo_url" {
    type    = varchar(255)
    null    = true
    comment = "URL of the organization's logo"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the organization was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the organization was last updated"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the organization was deleted"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the organization"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the organization"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the organization"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_organizations_languages" {
    columns = [column.lang_code]
    ref_columns = [table.languages.column.code]
  }
}

table "groups" {
  schema  = schema.main_schema
  comment = "Table for storing group information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the group"
  }

  column "user_id" {
    type    = varchar(16)
    null    = false
    comment = "Identifier of the user associated with the group"
  }

  column "is_owner" {
    type    = boolean
    null    = false
    default = false
    comment = "Flag indicating if the user is the owner of the group"
  }

  column "organization_id" {
    type    = varchar(16)
    null    = false
    comment = "Identifier of the organization associated with the group"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the language was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the language was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the language"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the language"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_groups_users" {
    columns     = [table.groups.column.user_id]
    ref_columns = [table.users.column.id]
    on_update   = "CASCADE"
    on_delete   = "CASCADE"
  }

  foreign_key "fk_groups_organizations" {
    columns     = [table.groups.column.organization_id]
    ref_columns = [table.organizations.column.id]
    on_update   = "CASCADE"
    on_delete   = "CASCADE"
  }
}

table "languages" {
  schema  = schema.main_schema
  comment = "Table for storing language information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the language"
  }

  column "code" {
    type    = varchar(5)
    null    = false
    comment = "Language code (e.g., en, fr, es)"
  }

  column "name" {
    type    = varchar(20)
    null    = false
    comment = "Language name"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the language was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the language was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the language"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the language"
  }

  primary_key {
    columns = [
      column.id
    ]
  }

  index "idx_languages_code" {
    columns = [column.code]
    unique  = true
  }
}

table "events" {
  schema  = schema.main_schema
  comment = "Table for storing event information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the event"
  }

  column "organization_id" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the organization associated with the event"
  }

  column "venue_id" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the venue associated with the event"
  }

  column "category_id" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the category associated with the event"
  }

  column "lang_code" {
    type    = varchar(5)
    null    = true
    comment = "Language code associated with the event"
  }

  column "name" {
    type    = varchar(255)
    null    = false
    comment = "Name of the event"
  }

  column "description" {
    type    = text
    null    = true
    comment = "Description of the event"
  }

  column "logo_url" {
    type    = varchar(255)
    null    = true
    comment = "URL of the event's logo"
  }

  column "poster_url" {
    type    = varchar(255)
    null    = true
    comment = "URL of the event's poster"
  }

  column "start_datetime" {
    type    = datetime
    null    = false
    comment = "Start date and time of the event"
  }

  column "status" {
    type    = varchar(10)
    null    = true
    comment = "Status of the event"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the event was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the event was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the event"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the event"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the organization was deleted"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the organization"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_events_organizations" {
    columns     = [column.organization_id]
    ref_columns = [table.organizations.column.id]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }

  foreign_key "fk_events_languages" {
    columns     = [column.lang_code]
    ref_columns = [table.languages.column.code]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }

  foreign_key "fk_events_venues" {
    columns     = [column.venue_id]
    ref_columns = [table.venues.column.id]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }

  foreign_key "fk_events_categories" {
    columns     = [column.category_id]
    ref_columns = [table.categories.column.id]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }
}

table "venues" {
  schema  = schema.main_schema
  comment = "Table for storing venue information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the venue"
  }

  column "lang_code" {
    type    = varchar(5)
    null    = true
    comment = "Language code associated with the venue"
  }

  column "name" {
    type    = varchar(255)
    null    = false
    comment = "Name of the venue"
  }

  column "address" {
    type    = varchar(255)
    null    = true
    comment = "Address of the venue"
  }

  column "description" {
    type    = varchar(255)
    null    = true
    comment = "Description of the venue"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the venue was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the venue was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the venue"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the venue"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the organization was deleted"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the organization"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_venues_languages" {
    columns     = [column.lang_code]
    ref_columns = [table.languages.column.code]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }
}

table "tickets" {
  schema  = schema.main_schema
  comment = "Table for storing ticket information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the ticket"
  }

  column "lang_code" {
    type    = varchar(5)
    null    = true
    comment = "Language code associated with the ticket"
  }

  column "name" {
    type    = varchar(255)
    null    = false
    comment = "Name of the ticket"
  }

  column "price" {
    type    = bigint
    null    = false
    comment = "Price of the ticket"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the ticket was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the ticket was last updated"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the ticket was deleted"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the ticket"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the ticket"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the ticket"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_tickets_languages" {
    columns     = [column.lang_code]
    ref_columns = [table.languages.column.code]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }
}

table "ticket_events" {
  schema  = schema.main_schema
  comment = "Table for associating tickets with events"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the ticket-event relationship"
  }

  column "event_id" {
    type    = varchar(16)
    null    = false
    comment = "Identifier of the event"
  }

  column "ticket_id" {
    type    = varchar(16)
    null    = false
    comment = "Identifier of the ticket"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the relationship was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the relationship was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the relationship"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the relationship"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_ticket_events_events" {
    columns     = [column.event_id]
    ref_columns = [table.events.column.id]
    on_update   = "CASCADE"
    on_delete   = "CASCADE"
  }

  foreign_key "fk_ticket_events_tickets" {
    columns     = [column.ticket_id]
    ref_columns = [table.tickets.column.id]
    on_update   = "CASCADE"
    on_delete   = "CASCADE"
  }
}

table "categories" {
  schema  = schema.main_schema
  comment = "Table for storing category information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the category"
  }

  column "name" {
    type    = varchar(255)
    null    = false
    comment = "Name of the category"
  }

  column "lang_code" {
    type    = varchar(5)
    null    = true
    comment = "Language code associated with the category"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the category was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the category was last updated"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the category was deleted"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the category"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the category"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the category"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_categories_languages" {
    columns     = [column.lang_code]
    ref_columns = [table.languages.column.code]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }
}

table "seats" {
  schema  = schema.main_schema
  comment = "Table for storing seat information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the seat"
  }

  column "row" {
    type    = varchar(255)
    null    = true
    comment = "Row identifier for the seat"
  }

  column "label" {
    type    = varchar(255)
    null    = true
    comment = "Label for the seat"
  }

  column "type" {
    type    = varchar(255)
    null    = true
    comment = "Type of the seat (e.g., VIP, Regular)"
  }

  column "status" {
    type    = varchar(10)
    null    = true
    comment = "Status of the seat (e.g., available, booked)"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the seat was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the seat was last updated"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the seat was deleted"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the seat"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the seat"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the seat"
  }

  primary_key {
    columns = [column.id]
  }
}

table "event_seats" {
  schema  = schema.main_schema
  comment = "Table for storing event seat information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the event seat"
  }

  column "event_id" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the event associated with the seat"
  }

  column "ticket_id" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the ticket associated with the seat"
  }

  column "row" {
    type    = varchar(255)
    null    = true
    comment = "Row identifier for the seat"
  }

  column "label" {
    type    = varchar(255)
    null    = true
    comment = "Label for the seat"
  }

  column "type" {
    type    = varchar(255)
    null    = true
    comment = "Type of the seat (e.g., VIP, Regular)"
  }

  column "status" {
    type    = varchar(10)
    null    = true
    comment = "Status of the seat (e.g., available, booked)"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the event seat was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the event seat was last updated"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the event seat was deleted"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the event seat"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the event seat"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the event seat"
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "fk_event_seats_events" {
    columns     = [column.event_id]
    ref_columns = [table.events.column.id]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }

  foreign_key "fk_event_seats_tickets" {
    columns     = [column.ticket_id]
    ref_columns = [table.tickets.column.id]
    on_update   = "CASCADE"
    on_delete   = "SET_NULL"
  }
}

table "payment_methods" {
  schema  = schema.main_schema
  comment = "Table for storing payment method information"

  column "id" {
    type    = varchar(16)
    null    = false
    comment = "Unique identifier for the payment method"
  }

  column "name" {
    type    = varchar(10)
    null    = false
    comment = "Name of the payment method"
  }

  column "logo_url" {
    type    = varchar(255)
    null    = true
    comment = "URL of the payment method's logo"
  }

  column "created_at" {
    type    = datetime
    null    = false
    default = sql("CURRENT_TIMESTAMP")
    comment = "Timestamp when the payment method was created"
  }

  column "updated_at" {
    type    = datetime
    null    = true
    default = sql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    comment = "Timestamp when the payment method was last updated"
  }

  column "created_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who created the payment method"
  }

  column "updated_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who last updated the payment method"
  }

  column "deleted_at" {
    type    = datetime
    null    = true
    comment = "Timestamp when the payment method was deleted"
  }

  column "deleted_by" {
    type    = varchar(16)
    null    = true
    comment = "Identifier of the user who deleted the payment method"
  }

  primary_key {
    columns = [column.id]
  }
}
