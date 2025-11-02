package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// RolePermission holds the schema definition for the RolePermission entity.
type RolePermission struct {
	ent.Schema
}

// Fields of the RolePermission.
func (RolePermission) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("role_id").
			NotEmpty(),
		field.String("permission_id").
			NotEmpty(),
		field.JSON("constraints", map[string]interface{}{}).
			Optional(),
		field.Time("created_at").
			Optional().
			Nillable().
			Immutable(),
	}
}

// Edges of the RolePermission.
func (RolePermission) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("role", Role.Type).
			Ref("role_permissions").
			Field("role_id").
			Unique().
			Required(),
		edge.From("permission", Permission.Type).
			Ref("role_permissions").
			Field("permission_id").
			Unique().
			Required(),
	}
}

// Indexes of the RolePermission.
func (RolePermission) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("role_id", "permission_id").Unique(),
	}
}
