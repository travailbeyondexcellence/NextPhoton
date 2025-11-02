package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Account holds the schema definition for the Account entity.
type Account struct {
	ent.Schema
}

// Fields of the Account.
func (Account) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("account_id").
			NotEmpty(),
		field.String("provider_id").
			NotEmpty(),
		field.String("user_id").
			NotEmpty(),
		field.String("access_token").
			Optional().
			Nillable().
			Sensitive(),
		field.String("refresh_token").
			Optional().
			Nillable().
			Sensitive(),
		field.String("id_token").
			Optional().
			Nillable().
			Sensitive(),
		field.Time("access_token_expires_at").
			Optional().
			Nillable(),
		field.Time("refresh_token_expires_at").
			Optional().
			Nillable(),
		field.String("scope").
			Optional().
			Nillable(),
		field.String("password").
			Optional().
			Nillable().
			Sensitive(),
		field.Time("created_at").
			Optional().
			Nillable().
			Immutable(),
		field.Time("updated_at").
			Optional().
			Nillable(),
	}
}

// Edges of the Account.
func (Account) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("accounts").
			Field("user_id").
			Unique().
			Required(),
	}
}
