function initializeCoreMod() {
    return {
        'blockstatemap': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.model.ModelBakery',
                'methodName': '<init>',
                'methodDesc': '(Lnet/minecraft/resources/IResourceManager;Lnet/minecraft/client/renderer/texture/AtlasTexture;Lnet/minecraft/client/renderer/color/BlockColors;Lnet/minecraft/profiler/IProfiler;)V'
            },
            'transformer': function(method) {
                print('[PlaceboASM]: Patching ModelBakery#<init>');

                var owner = "shadows/placebo/statemap/ModelMapRegistry";
                var name = "getMRL";
                var desc = "(Lnet/minecraft/client/renderer/model/ModelResourceLocation;Lnet/minecraft/util/ResourceLocation;)Lnet/minecraft/client/renderer/model/ModelResourceLocation;";
                var instr = method.instructions;

                var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
				var i;
				var j = 0;
				for (i = 0; i < instr.size(); i++) {
					var n = instr.get(i);
					if (n.getOpcode() == Opcodes.INVOKESPECIAL) {
						var is = n.name.equals(ASMAPI.mapMethod("func_217843_a"));
						if (is && ++j == 2) { 
							instr.insertBefore(n, new VarInsnNode(Opcodes.ALOAD, 6));
							instr.insertBefore(n, ASMAPI.buildMethodCall(
								owner,
								name,
								desc,
								ASMAPI.MethodType.STATIC));
						}
					}
				}
				
                return method;
            }
        }
    }
}