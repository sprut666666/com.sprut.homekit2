#include <nan.h>
#include "chacha.h"
#include "poly.h"
#include "aead.h"
#include "legacy.h"
using namespace v8;

void InitAll(Local<Object> exports) {
  Chacha::Init(exports);
  Poly::Init(exports);
  AEAD::Init(exports);
  Legacy::Init(exports);
}

NODE_MODULE(addon, InitAll)
