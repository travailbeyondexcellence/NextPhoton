package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// UserRole holds the schema definition for the UserRole entity.
type UserRole struct {
	ent.Schema
}

// Fields of the UserRole.
func (UserRole) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("user_id").
			NotEmpty(),
		field.String("role_id").
			NotEmpty(),
		field.String("organization_id").
			Optional().
			Nillable(),
		field.JSON("metadata", map[string]interface{}{}).
			Optional(),
		field.Bool("is_active").
			Default(true),
		field.Time("assigned_at").
			Optional().
			Nillable().
			Immutable(),
		field.Time("expires_at").
			Optional().
			Nillable(),
		field.String("assigned_by").
			Optional().
			Nillable(),
	}
}

// Edges of the UserRole.
func (UserRole) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("user_roles").
			Field("user_id").
			Unique().
			Required(),
		edge.From("role", Role.Type).
			Ref("user_roles").
			Field("role_id").
			Unique().
			Required(),
	}
}

// Indexes of the UserRole.
func (UserRole) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("user_id", "role_id", "organization_id").
			Unique().
			Annotations(entsql.IndexWhere("organization_id IS NOT NULL")),
		index.Fields("user_id", "role_id").
			Unique().
			Annotations(entsql.IndexWhere("organization_id IS NULL")),
	}
}
