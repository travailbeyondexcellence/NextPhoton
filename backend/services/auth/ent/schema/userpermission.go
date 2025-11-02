package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// UserPermission holds the schema definition for the UserPermission entity.
type UserPermission struct {
	ent.Schema
}

// Fields of the UserPermission.
func (UserPermission) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("user_id").
			NotEmpty(),
		field.String("permission_id").
			NotEmpty(),
		field.String("override_type").
			NotEmpty().
			Comment("grant or deny"),
		field.JSON("constraints", map[string]interface{}{}).
			Optional(),
		field.String("organization_id").
			Optional().
			Nillable(),
		field.String("granted_by").
			Optional().
			Nillable(),
		field.Time("granted_at").
			Optional().
			Nillable().
			Immutable(),
		field.Time("expires_at").
			Optional().
			Nillable(),
		field.String("reason").
			Optional().
			Nillable(),
	}
}

// Edges of the UserPermission.
func (UserPermission) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("user_permissions").
			Field("user_id").
			Unique().
			Required(),
		edge.From("permission", Permission.Type).
			Ref("user_permissions").
			Field("permission_id").
			Unique().
			Required(),
	}
}

// Indexes of the UserPermission.
func (UserPermission) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("user_id", "permission_id", "organization_id").
			Unique().
			Annotations(entsql.IndexWhere("organization_id IS NOT NULL")),
		index.Fields("user_id", "permission_id").
			Unique().
			Annotations(entsql.IndexWhere("organization_id IS NULL")),
	}
}
