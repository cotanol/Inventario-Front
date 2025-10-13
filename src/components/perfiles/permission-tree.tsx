import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import type { IOpcionMenu } from "./perfil-schema";

// Tipo para la estructura jerárquica
export interface PermissionNode extends IOpcionMenu {
  hijos: PermissionNode[];
}

interface PermissionTreeProps {
  nodes: PermissionNode[];
  selectedIds: number[];
  onToggle: (id: number, isSelected: boolean) => void;
}

// Componente que se llama a sí mismo para renderizar los hijos
const TreeNode = ({
  node,
  selectedIds,
  onToggle,
  level,
}: {
  node: PermissionNode;
  selectedIds: number[];
  onToggle: (id: number, isSelected: boolean) => void;
  level: number;
}) => {
  const isSelected = selectedIds.includes(node.opcionMenuId);

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      {/* Si no tiene hijos, es un checkbox. Si tiene hijos, es un título. */}
      {node.hijos.length === 0 ? (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0 my-2">
          <FormControl>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onToggle(node.opcionMenuId, !!checked)
              }
            />
          </FormControl>
          <FormLabel className="font-normal text-sm">{node.nombre}</FormLabel>
        </FormItem>
      ) : (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700">{node.nombre}</h4>
          <hr className="mb-2" />
        </div>
      )}

      {/* Renderizar los hijos recursivamente */}
      {node.hijos.map((childNode) => (
        <TreeNode
          key={childNode.opcionMenuId}
          node={childNode}
          selectedIds={selectedIds}
          onToggle={onToggle}
          level={level + 1}
        />
      ))}
    </div>
  );
};

export const PermissionTree = ({
  nodes,
  selectedIds,
  onToggle,
}: PermissionTreeProps) => {
  return (
    <div>
      {nodes.map((node) => (
        <TreeNode
          key={node.opcionMenuId}
          node={node}
          selectedIds={selectedIds}
          onToggle={onToggle}
          level={0}
        />
      ))}
    </div>
  );
};
